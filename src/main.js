import "./css/index.css"
import IMask from "imask"
//dois query selectors para pegar os dois G contendo os dados de cores do cartao
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function mudaTipoCartao(tipo) {
  //Estrutura de dados contendo as cores utilizadas pelos cartões
  const cores = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    hipercard: ["#821A1A", "#821A1A"],
    elo: ["#000000", "#C3B321"],
    default: ["black", "grey"],
  }
  //Mudando a cor do cartao baseado no argumento passado para a função, pegando a entrada 0 e 1 do array
  ccBgColor01.setAttribute("fill", cores[tipo][0])
  ccBgColor02.setAttribute("fill", cores[tipo][1])
  ccLogo.setAttribute("src", `cc-${tipo}.svg`)
}

//Mascara para o codigo de segurança
const codSeg = document.querySelector("#security-code")
const padCodSeg = {
  mask: "000",
}
const codSegMask = IMask(codSeg, padCodSeg)

//Data de expiração
const dtExp = document.querySelector("#expiration-date")
const padDtExp = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const dtExpMask = IMask(dtExp, padDtExp)

const numCart = document.querySelector("#card-number")
const padNumCart = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^((((636368)|(438935)|(504175)|(451416)|(636297))d{0,10})|((5067)|(4576)|(4011))d{0,12})$/,
      tipoCart: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
      tipoCart: "hipercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2}\d{0,12}/,
      tipoCart: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      tipoCart: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      tipoCart: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const num = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      mudaTipoCartao(item.tipoCart)
      return num.match(item.regex)
    })
    return foundMask
  },
}

const numCartMask = IMask(numCart, padNumCart)
//Setando um eventListener pra captar o clique do botao
const addBtn = document.querySelector("#AddCart")
addBtn.addEventListener("click", () => {
  alert("Cartão adicionado com sucesso!")
})
//Faz o form ignorar seu comportamento padrão, o tornando fácil de editar e customizar as funções
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})
//Substituir o nome template do cartão com o nome digitado no input
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerHTML =
    cardHolder.value === "" ? "FULANO DA SILVA" : cardHolder.value
})

codSegMask.on("accept", () => {
  attCvv(codSegMask.value)
})
function attCvv(code) {
  const ccSeg = document.querySelector(".cc-security .value")
  ccSeg.innerText = code === "" ? "123" : code
}

numCartMask.on("accept", () => {
  attNumCart(numCartMask.value)
})
function attNumCart(num) {
  const ccNum = document.querySelector(".cc-number")
  ccNum.innerText = num === "" ? "1234 5678 9012 3456" : num
}

dtExpMask.on("accept", () => {
  attDtExp(dtExpMask.value)
})

function attDtExp(date) {
  const ccExp = document.querySelector(".cc-extra .value")
  ccExp.innerText = date === "" ? "02/32" : date
}
