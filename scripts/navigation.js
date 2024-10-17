// Dados das fichas carregadas
// var portfolioData = {}; 

function navigateTo(page) {
    const contentDiv = document.getElementById('content');

    // Alterar o conteúdo dinamicamente
    if (page === 'fichas') {
        contentDiv.innerHTML = renderSheetList(currentPortfolio);
    } 
    else if (page === 'exportacao') {
        contentDiv.innerHTML = renderExportOptions();
    } 
    else if (page === 'tracker') {
        contentDiv.innerHTML = renderCombatTracker(currentPortfolio);
    }

    // Atualizar URL (opcional)
    history.pushState({ page }, '', page);
}

// Manter estado ao usar o botão de voltar do navegador
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        navigateTo(event.state.page);
    }
});
