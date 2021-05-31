ar idatual = 0;
var modalCadastro;
var modalAlerta;
var modalExcluir;

window.onload = function(e) {
    listar();
}

function sair() {
    sessionStorage.setItem('meutoken', undefined);
 	window.location.href = "index.js";
}

function listar() {
    //limpar tabela
    var tab = document.getElementById("tabela");
    for (var i=tab.rows.length -1; i>0; i--) {
        tab.deleteRow(i);
    }
    
   
    
    var myHeaders = new Headers();
	myHeaders.append("AUTHORIZATION", "Bearer " + sessionStorage.getItem('meutoken'));

    fetch("http://localhost:8080/Veiculo.js", {method: "GET", headers: myHeaders})
    .then(response => response.json())
    .then(data => {
        for (const item of data) {
        
            var tab = document.getElementById("tabela");
            var row = tab.insertRow(-1);
            row.insertCell(-1).innerHTML = item.placa;
            row.insertCell(-1).innerHTML = item.modelo
            row.insertCell(-1).innerHTML = item.marca;
            row.insertCell(-1).innerHTML = item.ano;
            row.insertCell(-1).innerHTML = item.valor;
            row.insertCell(-1).innerHTML = "<button type='button' class='btn btn-primary' "
            + " onclick='alterar("+item.idveiculo+")'> "
            + "<i class='bi bi-pencil'></i></button>"
            + "<button type='button' class='btn btn-danger' "
            + " onclick='excluir("+item.idveiculo+")'> "
            + "<i class='bi bi-trash'></i></button>";
        }
    })
    .catch(error => console.log("Erro", error));


}

function novo() {
    idatual = 0;
    document.getElementById("txtPlaca").value = "";
    document.getElementById("txtModelo").value = "";
    document.getElementById("txtMarca").value = "";
    document.getElementById("txtAno").value = "";
    document.getElementById("txtValor").value = "";

    

    modalCadastro = new bootstrap.Modal(document.getElementById("modalCadastro"));
    modalCadastro.show();
}
function alterar(id) {
    idatual = id;
    
    var myHeaders = new Headers();
	myHeaders.append("AUTHORIZATION", "Bearer " + sessionStorage.getItem('meutoken'));
    

    fetch("http://localhost:8080/Veiculo.js/"+idatual, {method: "GET", headers: myHeaders})
    .then(response => response.json())
    .then(data => {
        
        document.getElementById("txtPlaca").value = data.placa;
	    document.getElementById("txtModelo").value = data.modelo;
	    document.getElementById("txtMarca").value = data.marca;
	    document.getElementById("txtAno").value = data.ano;
	    document.getElementById("txtValor").value = data.valor;
        
 
        
        modalCadastro = new bootstrap.Modal(document.getElementById("modalCadastro"));
        modalCadastro.show();
        
    })
    .catch(error => console.log("Erro", error));

}
function excluir(id) {
    idatual = id;
    document.getElementById("modalAlertaBody").style.backgroundColor = "#FFFFFF";
    document.getElementById("modalAlertaBody").innerHTML = "<h5>Confirma a exclusão do registro? </h5>"
    + '<button type="button" class="btn btn-primary" onclick="excluirSim()">Sim</button>'
    + '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não</button>';
    modalExcluir = new bootstrap.Modal(document.getElementById("modalAlerta"));
    modalExcluir.show();
}
function excluirSim() {
	var myHeaders = new Headers();
	myHeaders.append("AUTHORIZATION", "Bearer " + sessionStorage.getItem('meutoken'));


    fetch("http://localhost:8080/Veiculo.js/" + idatual, {method: "DELETE", headers: myHeaders})
    .then(response => {
        const status = response.status;
        modalExcluir.hide();
        listar();
        if (status==200) {
            mostrarAlerta("Registro excluído com sucesso!", true);
        } else {
            mostrarAlerta("Falha ao excluir registro!", false);
        }
    })
    .catch(error => console.log("Erro", error));
}

function salvar() {
    var p = {
        idveiculo: idatual,
        placa: document.getElementById("txtPlaca").value,
        modelo: document.getElementById("txtModelo").value,
        marca: document.getElementById("txtMarca").value,
       ano: document.getElementById("txtAno").value,
        valor: parseFloat(document.getElementById("txtValor").value)
    };

    var json = JSON.stringify(p);
    
    console.log(json);

    var url;
    var metodo;
    if (idatual==0) {
        url = "http://localhost:8080/Veiculo.js";
        metodo = "POST";
    } else {
        url = "http://localhost:8080/Veiculo.js/" + idatual;
        metodo = "PUT";
    }
    
    var myHeaders = new Headers();
	myHeaders.append("AUTHORIZATION", "Bearer " + sessionStorage.getItem('meutoken'));
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    
    fetch(url, {method: metodo, body: json, redirect: 'follow', headers: myHeaders}) 
    .then(response => response.json())
    .then(result => {
        if (result.idveiculo>0) {
            mostrarAlerta("Cadastro Efetuado com Sucesso", true);
            modalCadastro.hide();
            listar();
        } else {
            mostrarAlerta("Falha ao inserir dados", false);
        }
    });

}

function mostrarAlerta(msg, success) {
    if (success) {
        document.getElementById("modalAlertaBody").style.backgroundColor = "#E0F2F1";
    } else {
        document.getElementById("modalAlertaBody").style.backgroundColor = "#FFEBEE";
    }
    document.getElementById("modalAlertaBody").innerHTML = msg;
    modalAlerta = new bootstrap.Modal(document.getElementById("modalAlerta"));
    modalAlerta.show();
    window.setTimeout(function() {
        modalAlerta.hide();
    }, 3000);
}