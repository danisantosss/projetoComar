import db from "../../config/db.js";
import {
  selectTodasMovimentacoes,
  selectUmaMovimentacao,
  pegarSaldo,
  criarMovimentacao,
  atualizarSaldo,
  deletarMovimentacao,
  atualizarMovimentacao,
  selecionarNovaMovimentacao,
} from "./queriesMovimentacao.js";

//VERIFICAR E INFORMAR SE EXISTEM MOVIMENTACOES
export const getMovimentacoes = (req, res) => {
  const { projetoid } = req.params;

  //indicação de movimentação não existe
  db.query(selectTodasMovimentacoes, [projetoid], (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
};

//VERIFICAR E INFORMAR SE ID DE MOVIMENTACAO EXISTE
export const getUmaMovimentacao = (req, res) => {
  const { projetoid, id } = req.params;

  //indicação de movimentação não existe
  db.query(selectUmaMovimentacao, [projetoid, id], (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
};

//VERIFICAR E INFORMAR SE OS DADOS SAO OU NAO VALIDOS
export const postMovimentacao = async (req, res) => {
  let { projetoid } = await req.params;
  let {
    valor,
    dataMovimento,
    notaFiscal,
    fornecedor,
    documento,
    historico,
    isEntrada,
  } = await req.body;

  valor = +valor

  if(isEntrada == 'false'){
    isEntrada = false
  } else if (isEntrada == 'true'){
    isEntrada = true
  }

  projetoid = +projetoid
  //indicação de movimentação não existe
  db.query(pegarSaldo, [projetoid], async (err, result) => {
    if (err) {
      throw err;
    } else {
      let NovoSaldo;
      if (isEntrada) {
        NovoSaldo = ( +result[0].saldo) + valor;
      } else if (!isEntrada) {
        NovoSaldo = ( +result[0].saldo) - valor;
      }

      db.query(
        criarMovimentacao,
        [
          projetoid,
          valor,
          dataMovimento,
          notaFiscal,
          NovoSaldo,
          fornecedor,
          documento,
          historico,
          isEntrada,
        ],
        (err, result) => {
          if (err) {
            throw err;
          } else {
            db.query(atualizarSaldo, [NovoSaldo, projetoid], (err, result) => {
              if (err) throw err;
            });
            db.query(selecionarNovaMovimentacao,[projetoid], (err,result) => {
              if(err) throw err;
              res.status(200).send(result[0])
            })
          }
        }
      );
    }
  });
};

//VERIFICAR E INFORMAR SE ID DE MOVIMENTACAO EXISTE
export const deleteMovimentacao = async (req, res) => {
  const { projetoid, id } = await req.params;
  //indicação de movimentação não existe

  db.query(selectUmaMovimentacao, [projetoid, id], (err, result) => {
    if (err) {
      throw err;
    } else {
      let valorDaMovimentacao = +result[0].valor;
      let verdadeiroOuFalso = result[0].isEntrada;

      db.query(pegarSaldo, [projetoid], async (err, result) => {
        if (err) {
          throw err;
        } else {
          let NovoSaldo;
          if (verdadeiroOuFalso) {
            NovoSaldo = (await +result[0].saldo) - valorDaMovimentacao;
          } else if (!verdadeiroOuFalso) {
            NovoSaldo = (await +result[0].saldo) + valorDaMovimentacao;
          }

          db.query(deletarMovimentacao, [id], (err, result) => {
            if (err) {
              throw err;
            } else {
              db.query(
                atualizarSaldo,
                [NovoSaldo, projetoid],
                (err, result) => {
                  if (err) throw err;
                }
              );
              res.status(200).json("Movimentacao Deletada");
            }
          });
        }
      });
    }
  });
};

//VERIFICAR E INFORMAR SE OS DADOS SAO OU NAO VALIDOS
//ASSIM COMO VERIFICAR E INFORMAR SE ID EXISTE
export const putMovimentacao = async (req, res) => {
  const { projetoid, id } = await req.params;
  const {
    valor,
    dataMovimento,
    notaFiscal,
    fornecedor,
    documento,
    historico,
    isEntrada,
  } = await req.body;
  //indicação de movimentação não existe

  db.query(selectUmaMovimentacao, [projetoid, id], (err, result) => {
    if (err) {
      throw err;
    } else {
      let valorDaMovimentacao = +result[0].valor;
      let verdadeiroOuFalso = result[0].isEntrada;

      db.query(pegarSaldo, [projetoid], async (err, result) => {
        if (err) {
          throw err;
        } else {
          let NovoSaldo;
          if (verdadeiroOuFalso) {
            NovoSaldo = (await +result[0].saldo) - valorDaMovimentacao;
          } else if (!verdadeiroOuFalso) {
            NovoSaldo = (await +result[0].saldo) + valorDaMovimentacao;
          }
          if (isEntrada) {
            NovoSaldo += valor;
          } else if (!isEntrada) {
            NovoSaldo -= valor;
          }

          db.query(
            atualizarMovimentacao,
            [
              valor,
              dataMovimento,
              notaFiscal,
              NovoSaldo,
              fornecedor,
              documento,
              historico,
              isEntrada,
              id,
            ],
            (err, result) => {
              if (err) {
                throw err;
              } else {
                db.query(
                  atualizarSaldo,
                  [NovoSaldo, projetoid],
                  (err, result) => {
                    if (err) throw err;
                  }
                );
                res
                  .status(200)
                  .json({
                    valor,
                    dataMovimento,
                    notaFiscal,
                    saldo: NovoSaldo,
                    fornecedor,
                    documento,
                    historico,
                    isEntrada,
                    id,
                  });
              }
            }
          );
        }
      });
    }
  });
};
