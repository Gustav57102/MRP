// JavaScript (HTML)
// Substitua 'YOUR_SHEET_ID' e 'YOUR_API_KEY' pelos seus valores
const spreadsheetId = '1_V2FCXKtxWrlSPez4r37Wnmp1C4SgmRYe7648r7SoYM';
const apiKey = 'YOUR_API_KEY'; // Substitua por sua chave API
const scriptUrl = 'https://script.google.com/macros/s/AKfycby00XbQdnABflUSq1tUMYd0aAkaYIn1klLZ06EFyx9t5UpSLFvHpX4_1H0XewVng-LY/exec'; // URL do seu script Google Apps Script

// Obtendo elementos do formulário HTML
const produtoLista = document.getElementById('produtoLista');
const produtos = document.getElementById('produtos');
const numeros = document.querySelectorAll('.input-group input[type="number"]');
const form = document.querySelector('form');

// Função para preencher o select de produtos (ProdutoLista)
function preencherSelectProdutos() {
  fetch(`${scriptUrl}?function=getProdutos`)
    .then(response => response.json())
    .then(data => {
      console.log('Dados recebidos (ProdutoLista):', data);

      // Limpar o select antes de preencher
      produtoLista.innerHTML = '';

      data.forEach(produto => {
        // Verificar se o produto é uma string válida
        if (typeof produto === 'string') {
          const option = document.createElement('option');
          option.value = produto;
          option.text = produto;
          produtoLista.appendChild(option);
        }
      });
    })
    .catch(error => {
      console.error('Erro ao buscar ProdutoLista:', error);
    });
}

function doGet(e) {
    var response = ContentService.createTextOutput(JSON.stringify(getData()));
    response.setMimeType(ContentService.MimeType.JSON);
    // Permite requisições de qualquer origem
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response;
  }
  
  function getData() {
    // Lógica para obter os dados da sua planilha
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lista de Materiais');
    var range = sheet.getRange("B2:B");
    var values = range.getValues();
    return values.map(row => row[0]).filter(String);
  }
  

// Chame a função para preencher o select ao carregar a página
preencherSelectProdutos();

// ... resto do seu código (preenchimento de matérias-primas, envio para planilha, etc.)

  
  // Preencher o select de produtos (ProdutoLista)
const produtosLista = ['Pulseira Monocromática', 'Pulseira Colorida', 'Colar Monocromático', 'Colar colorido', 'Chaveiro'];
produtosLista.forEach(produto => {
  const option = document.createElement('option');
  option.value = produto;
  option.text = produto;
  produtoLista.appendChild(option);
});


// Preencher o select de matérias-primas
const materiasPrimas = ['nylon', 'bolinhas', 'miçangas amarelas', 'bolinhas com letras'];
materiasPrimas.forEach(materiaPrima => {
  const option = document.createElement('option');
  option.value = materiaPrima;
  option.text = materiaPrima;
  produtos.appendChild(option);
});

// Função para enviar os dados para a planilha Google
function enviarParaPlanilha(produtoSelecionado, produtosSelecionados, numerosValores) {
    const data = {
      values: [[, produtoSelecionado, produtosSelecionados.join(','), ...numerosValores]]
    };
  
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=RAW`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response   was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:',   
   error);
    });
  }

  function authorize() {
    var authorization = UrlFetchApp.authorize('https://www.googleapis.com/auth/spreadsheets');
    
  }
// Evento de envio do formulário
form.addEventListener('submit', (event) => {
    event.preventDefault();
  
    // Coletar os valores dos campos
    const produtoSelecionado = produtoLista.value;
    const produtosSelecionados = Array.from(produtos.selectedOptions).map(option => option.value);
    const numerosValores = Array.from(numeros).map(input => input.value);
  
    // Validação (implementar aqui)
    // Exemplo de validação: verificar se o produto foi selecionado
    const isProdutoSelecionado = produtoSelecionado !== '';
  
    // Se a validação passar, envia os dados
    if (isProdutoSelecionado) {
      enviarParaPlanilha(produtoSelecionado, produtosSelecionados, numerosValores);
    } else {
      // Exibir mensagem de erro ao usuário
      console.error('Por favor, selecione um produto.');
    }
  });

  
