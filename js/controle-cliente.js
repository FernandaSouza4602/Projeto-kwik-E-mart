const URL = 'http://localhost:3400/clientes';
let modoEdição = false;

let listaClientes = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaCliente = document.querySelector('table>tbody');
let modalCliente = new bootstrap.Modal(document.getElementById("modal-cliente"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar =  document.getElementById('btn-salvar');
let btnCancelar =  document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    telefone: document.getElementById('telefone'),
    cpf: document.getElementById('cpf'),
    dataCadastro: document.getElementById('dataCadastro'),
}

btnAdicionar.addEventListener('click', () =>{
    modoEdição = false;
    tituloModal.textContent = "Adicionar cliente"
    limparModalCliente();
    modalCliente.show();
});

btnSalvar.addEventListener('click', () => {

    let cliente = obterClienteDoModal();

    if(!cliente.cpfOuCnpj || !cliente.email){
        alert("E-mail e CPF são obrigatórios.")
        return;
    }

    (modoEdição) ? atualizarClienteBackend(cliente) : adicionarClienteBackend(cliente);

});

btnCancelar.addEventListener('click', () => {
    modalCliente.hide();
});


function obterClienteDoModal(){
    
    return new Cliente({
        id: formModal.id.value,
        nome: formModal.nome.value,
        email: formModal.email.value,
        telefone: formModal.telefone.value,
        cpfOuCnpj: formModal.cpf.value,
        dataCadastro: (formModal.dataCadastro.value) 
                 ? new Date(formModal.dataCadastro.value).toISOString()
                 : new Date().toISOString()
    });
}

function obterClientes() {

    fetch(URL, {
        method : "GET"
    })
    .then(response => response.json())
    .then(clientes =>{
        listaClientes = clientes;
        popularTabela(clientes);
    })
    .catch()
}

function editarCliente(id){
    modoEdição = true;
    tituloModal.textContent = "Editar Cliente";

    let cliente = listaClientes.find(cliente => cliente.id == id);

    atualizarModalCliente(cliente);

    modalCliente.show();
    //alert('Aqui vou editar o cliente ' + id);
}

function atualizarModalCliente(cliente){

    formModal.id.value = cliente.id;
    formModal.nome.value = cliente.nome;
    formModal.cpf.value = cliente.cpfOuCnpj;
    formModal.email.value = cliente.email;
    formModal.telefone.value = cliente.telefone;
    formModal.dataCadastro.value = cliente.dataCadastro.substring(0,10);
}

function limparModalCliente(){

    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.cpf.value = "";
    formModal.email.value = "";
    formModal.telefone.value = "";
    formModal.dataCadastro.value = "";
}

function excluirCliente(id){

    let cliente = listaClientes.concat.find(c => c.id == id);
   
    if(confirm("Deseja realmente excluir o cliente " + cliente.nome)){
        excluirClienteBackend(cliente);
    }
}

function criarLinhaNaTabela(cliente){

    let tr = document.createElement('tr');
        
        let tdId = document.createElement('td');
        let tdNome = document.createElement('td');
        let tdCPF = document.createElement('td');
        let tdEmail = document.createElement('td');
        let tdTelefone = document.createElement('td');
        let tdAcoes = document.createElement('td');
        let tdDataCadastro = document.createElement('td');
        

        tdId.textContent = cliente.id;
        tdNome.textContent = cliente.nome;
        tdCPF.textContent = cliente.cpfOuCnpj;
        tdEmail.textContent = cliente.email;
        tdDataCadastro.textContent = new Date(cliente.dataCadastro).toLocaleDateString();
        tdTelefone.textContent = cliente.telefone;

        tdAcoes.innerHTML = `<button onclick="editarCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                               Editar
                             </button>
                             <button onclick="excluirCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                               Excluir
                             </button>`;


        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdCPF);
        tr.appendChild(tdEmail);
        tr.appendChild(tdTelefone);
        tr.appendChild(tdDataCadastro);
        tr.appendChild(tdAcoes);

        tabelaCliente.appendChild(tr);
}
function popularTabela(clientes){

    tabelaCliente.textContent = "";

    clientes.forEach(cliente => {
        criarLinhaNaTabela(cliente);
    });
}


function adicionarClienteBackend(cliente){

    cliente.dataCadastro = new Date().toISOString();

    fetch(URL, {
        method: "POST",  // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "obterToken"
        },
        body : JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(response => {

        let novoCliente = new Cliente(response);
        listaClientes.push(novoCliente);

        popularTabela(listaClientes)

        modalCliente.hide();
    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarClienteBackend(cliente){

    fetch(`${URL}/${cliente.id}`, {
        method: "PUT",  // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body : JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(() => {
       atualizarClienteNaLista(cliente, false);
       modalCliente.hide();
    })
    .catch(error => {
        console.log(error)
    });
}

function excluirClienteBackend(cliente){

    fetch(`${URL}/${cliente.id}`, {
        method: "DELETE",  // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
    })
    .then(response => response.json())
    .then(() => {
       atualizarClienteNaLista(cliente, true);
       modalCliente.hide();
    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarClienteNaLista(cliente, removerCliente){

    let indice = listaClientes.findIndex((c) => c.id == cliente.id);

    (removerCliente)
        ? listaClientes.splice(indice, 1)
        : listaClientes.splice(indice, 1, cliente);

    popularTabela(listaClientes);
}

obterClientes();


