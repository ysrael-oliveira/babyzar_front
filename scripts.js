
// Função para consultar lista existente por meio de requisição GET
const consultarItens = async() => {
    let url = 'http://127.0.0.1:5000/roupas'
    fetch(url, {
        method: 'get'
      })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data.roupas.forEach((item) => inserirLinha(item.id, item.nome, item.categoria, item.tamanho, item.valor_de_compra, item.valor_de_venda));
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Função que adiciona um bot
const removerLinha = (e) =>{
    const botao = e.target;
    botao.closest("tr").remove();
}

consultarItens();


// Função para adicionar um novo item no banco de dados via POST
const postarItem = async (inputNome, inputCategoria, inputTamanho, inputValorCompra, inputValorVenda) => {
    const formData = new FormData();
    formData.append('nome', inputNome);
    formData.append('categoria', inputCategoria);
    formData.append('tamanho', inputTamanho);
    formData.append('valor_de_compra', inputValorCompra);
    formData.append('valor_de_venda', inputValorVenda);

    // debugar para ver se dados estao preenchidos corretamente
    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    let url = 'http://127.0.0.1:5000/roupa'
    try{
        const response = await fetch(url, {
            method: 'post',
            body: formData
          })
        
        const data = await response.json();
        return data.id;
    }
    catch(error) {
        console.error('Error:', error);
    };
}

// Função chamada quando um novo item é adicionado
const novoItem = async (event) => {

    let inputNome = document.getElementById("nome").value;
    let inputCategoria = document.getElementById("categoria").value;
    let inputTamanho = document.getElementById("tamanho").value;
    let inputValorCompra = document.getElementById("valor_compra").value;
    let inputValorVenda = document.getElementById("valor_venda").value;

    if(!inputNome || !inputValorCompra || !inputValorVenda ){
        alert('Todos os campos são obrigatórios!');
    }
    else{
        const produtoId = await postarItem(inputNome, inputCategoria, inputTamanho, inputValorCompra, inputValorVenda);
        let idDisplay;

        if(produtoId){
            idDisplay = produtoId;
        }
        else{
            idDisplay = "-"; // exibir um dash caso não esteja ligado ao servidor
        }
        
        inserirLinha(idDisplay, inputNome, inputCategoria, inputTamanho, inputValorCompra, inputValorVenda);
        alert('Item adicionado com sucesso!');    
    }

}

// Função para deletar um item no banco de dados, com requisição DELETE
const deletarItem = (id) => {
    let url = `http://127.0.0.1:5000/roupa?id=${id}`;
    fetch(url, {
        method: 'delete'
      })
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Função para inserir produto na tabela
const inserirLinha = (id, inputNome, inputCategoria, inputTamanho, inputValorCompra, inputValorVenda) =>{
    var item = [id, inputNome, inputCategoria, inputTamanho, inputValorCompra, inputValorVenda]
    var tabela = document.getElementById("tabelaRoupas");
    var linha = tabela.insertRow();

    //loop para preencher a linha com os dados fornecidos
    var i = 0
    while(i < item.length){
        var dado = linha.insertCell(i);
        dado.textContent = item[i];
        i++;
    }
    // insere um botão 
    const ultimoElemento = linha.insertCell(-1);
    const botao = document.createElement("button");
    
    botao.className = "botao";
    botao.textContent = "Remover";
    botao.onclick = () => {
        const idParaApagar = linha.cells[0].textContent;
        let apagar = confirm(`Confirma que deseja apagar a roupa ${idParaApagar}?`)
        if(apagar){
            deletarItem(idParaApagar);
            linha.remove();            
        }
    }
    ultimoElemento.appendChild(botao);

    //reseta os campos de input para uma nova inserção
    document.getElementById("nome").value = "";
    document.getElementById("categoria").value = "Casa";
    document.getElementById("tamanho").value = "0-3m";
    document.getElementById("valor_compra").value = "";
    document.getElementById("valor_venda").value = "";
}