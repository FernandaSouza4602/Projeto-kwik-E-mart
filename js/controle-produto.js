const URL = 'http://localhost:3400/produtos';


let listaProdutos = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaProduto = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById("modal-produto"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    valor: document.getElementById('valor'),
    quantidadeEstoque: document.getElementById('quantidadeEstoque'),
    observacao: document.getElementById('observacao'),
    dataCadastro: document.getElementById('dataCadastro')
}

btnAdicionar.addEventListener('click', () =>{
    modoEdicao = false;
    tituloModal.textContent = "Adicionar produto"
    limparModalProduto();
    modalProduto.show();
});

btnSalvar.addEventListener('click', () => {
    // 1° Capturar os dados do modal
    let produto = obterProdutoDoModal();

    // 2° Se os campos obrigatorios foram preenchidos.
    if(!produto.nome || !produto.quantidadeEstoque){
        alert("Nome do produto e estoque são obrigatórios.")
        return;
    }


    (modoEdicao) ? atualizarProdutoBackEnd(produto) : adicionarProdutoBackEnd(produto);

});

btnCancelar.addEventListener('click', () => {
    modalProduto.hide();
});

function limparModalProduto(){
    formModal.id.value='';
    formModal.nome.value="";
    formModal.valor.value='';
    formModal.quantidadeEstoque.value='';
    
}

function obterProdutoDoModal(){

    return new Produto({
        
        id: formModal.id.value,
        valor: formModal.valor.value,
        nome: formModal.nome.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value) 
                ? new Date(formModal.dataCadastro.value).toISOString()
                : new Date().toISOString()
    });
}
 
function obterProdutos() {

    fetch(URL, {
        method: 'GET',
        headers :{
            'Authorization': obterToken()
        }
    })
        .then(response => response.json())
        .then(produtos => {
            listaProdutos = produtos;
            popularTabela(produtos);
        })
        .catch()
}

function editarProduto(id){
    modoEdicao = true;
    tituloModal.textContent = "Editar produto"

    let produto = listaProdutos.find(produto => produto.id == id);
    
    atualizarModalProduto(produto);

    modalProduto.show();
}

function atualizarModalProduto(produto){

    formModal.id.value = produto.id;
    formModal.nome.value = produto.nome;
    formModal.valor.value = produto.valor;
    formModal.quantidadeEstoque.value = produto.quantidadeEstoque;
    formModal.observacao.value = produto.observacao;
    formModal.dataCadastro.value = produto.dataCadastro.substring(0,10);
}



function excluirProduto(id){

    let produto = listaProdutos.find(c => c.id == id);

    if(confirm("Deseja realmente excluir o produto " + produto.nome)){
        excluirProdutoBackEnd(produto);
    }
    
}

function criarLinhaNaTabela(produto) {
    // 1° Criar uma linha da tabela OK
    let tr = document.createElement('tr');

    // 2° Criar as TDs OK
    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');


    // 3° Atualizar as Tds com os valores do cliente OK
    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdEstoque.textContent = produto.quantidadeEstoque;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdObservacao.textContent = produto.observacao;

    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
        <i class="fas fa-pen"></i> Editar
    </button>
    <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary-disabled btn-sm">
        <i class="fas fa-trash"></i> Excluir
    </button>`;
 



    // 4° Adicionar as TDs dentro da linha criei. OK
    tr.appendChild(tdId)
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    // 5° Adicionar a linha na tabela.
    tabelaProduto.appendChild(tr);
}

function popularTabela(produtos) {

    // Limpar a tabela...
    tabelaProduto.textContent = "";

    produtos.forEach(produto => {
        criarLinhaNaTabela(produto);
    });
}

function adicionarProdutoBackEnd(produto){

    produto.dataCadastro = new Date().toISOString();

    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body : JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {

        let novoProduto = new Produto(response);
        listaProdutos.push(novoProduto);

        popularTabela(listaProdutos)

        modalProduto.hide();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Produto cadastrado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}


function atualizarProdutoBackEnd(produto){

    fetch(`${URL}/${produto.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body : JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(() => {
        atualizarProdutoNaLista(produto, false);
        modalProduto.hide();

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Produto atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}

function excluirProdutoBackEnd(produto){

    fetch(`${URL}/${produto.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        }
    })
    .then(response => response.json())
    .then(() => {
        atualizarProdutoNaLista(produto, true);
        modalProduto.hide();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Produto excluido com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarProdutoNaLista(produto, removerProduto){

    let indice = listaProdutos.findIndex((c) => c.id == produto.id);

    (removerProduto) 
        ? listaProdutos.splice(indice, 1)
        : listaProdutos.splice(indice, 1, produto);

    popularTabela(listaProdutos);
}

obterProdutos();