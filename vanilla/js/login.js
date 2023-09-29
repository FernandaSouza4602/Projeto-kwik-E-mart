let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnEntrar = document.getElementById('btn-entrar');

btnEntrar.addEventListener('click', () => {

    let userEmail = email.value;

    let userSenha = senha.value; 

    if(!userEmail || !userSenha){

        Swal.fire({
            icon: 'error',
            text: 'Os campos de e-mail e senha são obrigatórios!',
        });
        //alert("Os campos de e-mail e senha são obrigatórios!");
        return;
    }

    autenticar(userEmail, userSenha);
})


function autenticar(email, senha){
    const urlBase = `http://localhost:3400`;

    fetch(`${urlBase}/login`, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, senha})
    })
    .then(response => response = response.json())
    .then(response => {

        if(!!response.mensagem){
            alert(response.mensagem);
            return;

        }else{

        salvarToken(response.token);
        salvarUsuario(response.usuario);

        mostrarLoading();
        
        setTimeout(() =>{
            window.open('controle-cliente.html', '_self');
        }, 5000)

        }
    });
}

function mostrarLoading(){
    const divLoading = document.querySelector('#loading');
    divLoading.style.display='block';

    const divBoxLogin = document.querySelector('div.caixa-login')
    divBoxLogin.style.display = 'none';
}