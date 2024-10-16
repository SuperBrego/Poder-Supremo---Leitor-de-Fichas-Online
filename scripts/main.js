
window.onload = () => {
    // Habilitando Popovers;
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    mainContent.innerHTML = HomeMainContent();
}

// Função para ler o arquivo JSON enviado
function handleFileUpload(event) {
    const file = event.target.files[0];

    if (file && file.type === "application/json") {
        const reader = new FileReader();

        // Função que será chamada quando o arquivo for lido
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                characterTest(jsonData);
                // appendAlert('Sucesso! A ficha carregará em instantes!', 'success');
            } catch (error) {
                console.error('Erro ao ler o arquivo JSON:', error);
                alert('Arquivo inválido. Certifique-se de que é um JSON válido.');
            }
        };
        // Ler o conteúdo do arquivo
        reader.readAsText(file);
    } else {
        alert('Por favor, envie um arquivo JSON válido.');
    }
}

// Função para verificar as propriedades no JSON
function characterTest(portfolio) {
    let portfolioData = getPortData(portfolio);

    for(let portData of portfolioData) {
        if(!portData.data) {
            $('#load-error-modal').modal('show');
            return;
        }
    }

    renderSheetList(portfolioData);
}