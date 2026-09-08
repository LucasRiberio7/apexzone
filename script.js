/* =========================================================
   DRIVEZONE
   JAVASCRIPT PRINCIPAL
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const lista = document.getElementById("lista");
const filtrosEl = document.getElementById("filtros");
const buscaEl = document.getElementById("campo-busca");
const precoEl = document.getElementById("campo-preco");
const precoOut = document.getElementById("valor-preco-out");

const form = document.getElementById("form-contato");
const feedback = document.getElementById("feedback");

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

const ano = document.getElementById("ano");


/* =========================================================
   EXPLODE VIEW
   ========================================================= */

const explodeModal =
  document.getElementById("explodeModal");

const explodeOverlay =
  document.getElementById("explodeOverlay");

const explodeClose =
  document.getElementById("explodeClose");

const explodeTitulo =
  document.getElementById("explodeTitulo");

const explodeCategoria =
  document.getElementById("explodeCategoria");

const explodePreco =
  document.getElementById("explodePreco");

const explodeImagem =
  document.getElementById("explodeImagem");

const explodeInteresse =
  document.getElementById("explodeInteresse");


/* =========================================================
   ESTADO
   ========================================================= */

let filtroAtivo = "Todos";


/* =========================================================
   MENU MOBILE
   ========================================================= */

function fecharMenu() {

  if (!menu || !menuToggle) {
    return;
  }

  menu.classList.remove("open");

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

}


if (menuToggle && menu) {

  menuToggle.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      const aberto =
        menu.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(aberto)
      );

    }
  );


  menu.querySelectorAll("a").forEach(
    (link) => {

      link.addEventListener(
        "click",
        fecharMenu
      );

    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (!menu.classList.contains("open")) {
        return;
      }

      if (
        menu.contains(event.target) ||
        menuToggle.contains(event.target)
      ) {
        return;
      }

      fecharMenu();

    }
  );

}


/* =========================================================
   ANO DO FOOTER
   ========================================================= */

if (ano) {

  ano.textContent =
    new Date().getFullYear();

}


/* =========================================================
   FORMATAÇÃO DE PREÇO
   ========================================================= */

function formatarPreco(valor) {

  return "R$ " +
    Number(valor).toLocaleString(
      "pt-BR"
    );

}


/* =========================================================
   FILTROS
   ========================================================= */

function montarFiltros() {

  if (!filtrosEl || !window.ITENS) {
    return;
  }


  const categorias = [
    "Todos",
    ...new Set(
      window.ITENS.map(
        item => item.categoria
      )
    )
  ];


  filtrosEl.innerHTML =
    categorias.map(
      categoria => {

        const ativo =
          categoria === "Todos"
            ? " ativo"
            : "";

        return `
          <button
            type="button"
            class="filtro-btn${ativo}"
            data-filtro="${categoria}"
          >
            ${categoria}
          </button>
        `;

      }
    ).join("");

}


/* =========================================================
   FILTRAR VEÍCULOS
   ========================================================= */

function filtrar(itens) {

  const termo =
    buscaEl
      ? buscaEl.value
          .trim()
          .toLowerCase()
      : "";


  const precoMax =
    precoEl
      ? Number(precoEl.value)
      : Infinity;


  return itens.filter(
    item => {

      const passaCategoria =
        filtroAtivo === "Todos" ||
        item.categoria === filtroAtivo;


      const passaBusca =
        !termo ||
        item.nome
          .toLowerCase()
          .includes(termo);


      const passaPreco =
        item.preco <= precoMax;


      return (
        passaCategoria &&
        passaBusca &&
        passaPreco
      );

    }
  );

}


/* =========================================================
   RENDERIZAR CATÁLOGO
   ========================================================= */

function renderizar() {

  if (!lista || !window.ITENS) {
    return;
  }


  const itens =
    filtrar(window.ITENS);


  if (itens.length === 0) {

    lista.innerHTML = `
      <p class="vazio">
        Nenhum veículo encontrado.
        Tente alterar os filtros ou a busca.
      </p>
    `;

    return;

  }


  lista.innerHTML =
    itens.map(
      item => {

        /*
         * O botão Explode View só aparece
         * quando o carro possui explodeImagem.
         */

        const botaoExplode =
          item.explodeImagem
            ? `
              <button
                type="button"
                class="btn-explode"
                data-explode="${item.nome}"
              >
                Explode View
              </button>
            `
            : "";


        return `

          <article class="item-card">

            <div class="img">

              <img
                src="${item.imagem}"
                alt="${item.nome}"
                loading="lazy"
                onerror="
                  this.style.display='none';
                  this.parentElement.textContent='🚗';
                "
              >

            </div>


            <div class="item-content">

              <h3>
                ${item.nome}
              </h3>


              <span class="tag">
                ${item.categoria}
              </span>


              <p class="preco">
                ${formatarPreco(item.preco)}
              </p>


              <div class="card-actions">

                <a
                  class="btn btn-primary small"
                  href="#contato"
                  data-veiculo="${item.nome}"
                >
                  Tenho interesse
                </a>

                ${botaoExplode}

              </div>

            </div>

          </article>

        `;

      }
    ).join("");

}


/* =========================================================
   EVENTOS DOS FILTROS
   ========================================================= */

if (filtrosEl) {

  montarFiltros();


  filtrosEl.addEventListener(
    "click",
    (event) => {

      const botao =
        event.target.closest(
          ".filtro-btn"
        );


      if (!botao) {
        return;
      }


      filtroAtivo =
        botao.dataset.filtro;


      filtrosEl
        .querySelectorAll(
          ".filtro-btn"
        )
        .forEach(
          button => {
            button.classList.remove(
              "ativo"
            );
          }
        );


      botao.classList.add("ativo");


      renderizar();

    }
  );

}


/* =========================================================
   BUSCA
   ========================================================= */

if (buscaEl) {

  buscaEl.addEventListener(
    "input",
    renderizar
  );

}


/* =========================================================
   FAIXA DE PREÇO
   ========================================================= */

if (precoEl) {

  precoEl.addEventListener(
    "input",
    () => {

      if (precoOut) {

        precoOut.textContent =
          formatarPreco(
            Number(precoEl.value)
          );

      }


      renderizar();

    }
  );

}


/* =========================================================
   INTERESSE NO VEÍCULO
   ========================================================= */

if (lista) {

  lista.addEventListener(
    "click",
    (event) => {

      const link =
        event.target.closest(
          "[data-veiculo]"
        );


      if (!link) {
        return;
      }


      const campoMensagem =
        document.getElementById(
          "mensagem"
        );


      const campoInteresse =
        document.getElementById(
          "interesse"
        );


      if (campoMensagem) {

        campoMensagem.value =
          `Olá! Tenho interesse no ${link.dataset.veiculo}.`;

      }


      /*
       * Leva o usuário até o formulário
       * sem precisar clicar novamente.
       */

      setTimeout(
        () => {

          if (campoMensagem) {
            campoMensagem.focus();
          }

        },
        300
      );

    }
  );

}


/* =========================================================
   ABRIR EXPLODE VIEW
   ========================================================= */

function abrirExplodeView(nomeVeiculo) {

  if (!explodeModal) {
    return;
  }


  const veiculo =
    window.ITENS.find(
      item =>
        item.nome === nomeVeiculo
    );


  if (!veiculo) {
    return;
  }


  /*
   * Preenche os dados do veículo
   */

  if (explodeTitulo) {

    explodeTitulo.textContent =
      veiculo.nome;

  }


  if (explodeCategoria) {

    explodeCategoria.textContent =
      veiculo.categoria;

  }


  if (explodePreco) {

    explodePreco.textContent =
      formatarPreco(
        veiculo.preco
      );

  }


  /*
   * Troca a imagem do Explode View
   */

  if (
    explodeImagem &&
    veiculo.explodeImagem
  ) {

    explodeImagem.src =
      veiculo.explodeImagem;

    explodeImagem.alt =
      `${veiculo.nome} em Explode View`;

  }


  /*
   * Guarda o veículo no botão
   * "Tenho interesse".
   */

  if (explodeInteresse) {

    explodeInteresse.dataset.veiculo =
      veiculo.nome;

  }


  /*
   * Abre o modal
   */

  explodeModal.classList.add(
    "ativo"
  );

  explodeModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

}


/* =========================================================
   EVENTO DO EXPLODE VIEW
   ========================================================= */

if (lista) {

  lista.addEventListener(
    "click",
    (event) => {

      const botao =
        event.target.closest(
          "[data-explode]"
        );


      if (!botao) {
        return;
      }


      const nome =
        botao.dataset.explode;


      abrirExplodeView(nome);

    }
  );

}


/* =========================================================
   FECHAR EXPLODE VIEW
   ========================================================= */

function fecharExplodeView() {

  if (!explodeModal) {
    return;
  }


  explodeModal.classList.remove(
    "ativo"
  );

  explodeModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* =========================================================
   BOTÃO X
   ========================================================= */

if (explodeClose) {

  explodeClose.addEventListener(
    "click",
    fecharExplodeView
  );

}


/* =========================================================
   CLICAR NO FUNDO
   ========================================================= */

if (explodeOverlay) {

  explodeOverlay.addEventListener(
    "click",
    fecharExplodeView
  );

}


/* =========================================================
   TECLA ESC
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      explodeModal &&
      explodeModal.classList.contains(
        "ativo"
      )
    ) {

      fecharExplodeView();

    }

  }
);


/* =========================================================
   BOTÃO "TENHO INTERESSE" DENTRO DO EXPLODE VIEW
   ========================================================= */

if (explodeInteresse) {

  explodeInteresse.addEventListener(
    "click",
    () => {

      const nome =
        explodeInteresse.dataset.veiculo;


      const campoMensagem =
        document.getElementById(
          "mensagem"
        );


      if (campoMensagem && nome) {

        campoMensagem.value =
          `Olá! Tenho interesse no ${nome}.`;

      }


      fecharExplodeView();

    }
  );

}


/* =========================================================
   FORMULÁRIO
   ========================================================= */

function mostrarErro(
  campo,
  mensagem
) {

  if (!form) {
    return;
  }


  const erro =
    form.querySelector(
      `[data-erro-para="${campo}"]`
    );


  if (erro) {

    erro.textContent =
      mensagem;

  }

}


function limparErros() {

  if (!form) {
    return;
  }


  form
    .querySelectorAll(
      ".campo-erro"
    )
    .forEach(
      elemento => {
        elemento.textContent = "";
      }
    );

}


function validarFormulario() {

  if (!form) {
    return false;
  }


  limparErros();


  let valido = true;


  const nome =
    form.nome.value.trim();


  if (nome.length < 2) {

    mostrarErro(
      "nome",
      "Digite seu nome completo."
    );

    valido = false;

  }


  const email =
    form.email.value.trim();


  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);


  if (!emailValido) {

    mostrarErro(
      "email",
      "Digite um e-mail válido."
    );

    valido = false;

  }


  const telefone =
    form.telefone.value
      .replace(/\D/g, "");


  if (telefone.length < 10) {

    mostrarErro(
      "telefone",
      "Digite um telefone válido com DDD."
    );

    valido = false;

  }


  return valido;

}


/* =========================================================
   SUBMIT DO FORMULÁRIO
   ========================================================= */

if (form) {

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (!validarFormulario()) {

        if (feedback) {

          feedback.classList.add(
            "mostrar",
            "erro"
          );

          feedback.textContent =
            "Verifique os campos destacados acima.";

        }

        return;

      }


      const nome =
        form.nome.value.trim();


      if (feedback) {

        feedback.classList.remove(
          "erro"
        );

        feedback.classList.add(
          "mostrar"
        );

        feedback.textContent =
          `Obrigado, ${nome}! Recebemos sua mensagem e vamos te chamar no WhatsApp em breve.`;

      }


      form.reset();

    }
  );

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

renderizar();