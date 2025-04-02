// Script para o tour da página
document.addEventListener('DOMContentLoaded', function() {
    const tourSteps = [
        {
            title: "Bem-vindo ao Digimon Status Simulator!",
            text: "Este tour irá guiá-lo pelos recursos principais do simulador de status para Digimons.",
            element: null
        },
        {
            title: "Configuração de Status",
            text: "Aqui você pode selecionar quais status positivos e negativos deseja simular no seu Digimon.",
            element: ".status-select"
        },
        {
            title: "Controles da Simulação",
            text: "Use estes botões para iniciar ou reiniciar a simulação de melhorias de status.",
            element: "#startGame"
        },
        {
            title: "Painel de Estatísticas",
            text: "Acompanhe o número de tentativas restantes e suas chances de sucesso nas melhorias.",
            element: ".stats-panel"
        },
        {
            title: "Interação com as Células da Tabela",
            text: "Cada célula representa um slot de upgrade para o status. Clique em uma célula para tentar melhorar aquele status. Uma tentativa será consumida cada vez que você clicar em uma célula.",
            element: "#positive-board"
        },
        {
            title: "Resultados de Sucesso e Falha",
            text: "Células verdes indicam um sucesso, células vermelhas indicam uma falha. A cada sucesso, sua chance diminui. A cada falha, sua chance aumenta.",
            element: ".slot"
        },
        {
            title: "Sistema de Chance de Sucesso",
            text: "A chance de sucesso varia entre 25% (mínimo) e 75% (máximo).",
            element: "#success-chance"
        },
        {
            title: "Tabelas de Status",
            text: "Nestas tabelas você pode visualizar e interagir com os slots de melhoria para cada status selecionado. Quanto mais a direita for o slot, mais status ele irá dar. Por isso, você deve tentar melhorar os slots mais a direita com probabilidades de sucesso mais altas.",
            element: "#positive-board"
        },
        {
            title: "Tabelas de Status Negativos",
            text: "Da mesma forma, aqui você pode subir os status negativos do seu Digimon. Dica: Você quer evitar que haja sucessos aqui. Use esses slots para tentar falhar e subir a chance de sucesso, mas tome cuidado com o limite de tentativas.",
            element: "#negative-board"
        }
    ];

    let currentStep = 0;
    const tourOverlay = document.getElementById('tour-overlay');
    const tourPopup = document.getElementById('tour-popup');
    const tourTitle = document.getElementById('tour-title');
    const tourText = document.getElementById('tour-text');
    const tourPrev = document.getElementById('tour-prev');
    const tourNext = document.getElementById('tour-next');
    const tourClose = document.getElementById('tour-close');
    const tourProgress = document.getElementById('tour-progress');
    const startTourBtn = document.getElementById('start-tour');

    // Iniciar o tour
    startTourBtn.addEventListener('click', function() {
        startTour();
    });

    // Botão próximo
    tourNext.addEventListener('click', function() {
        if (currentStep < tourSteps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    // Botão anterior
    tourPrev.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Botão fechar
    tourClose.addEventListener('click', function() {
        endTour();
    });

    function startTour() {
        tourOverlay.style.display = 'block';
        tourPopup.style.display = 'block';
        currentStep = 0;
        showStep(currentStep);
    }

    function endTour() {
        tourOverlay.style.display = 'none';
        tourPopup.style.display = 'none';
        // Remover destaque de qualquer elemento
        const highlighted = document.querySelector('.tour-highlight');
        if (highlighted) {
            highlighted.classList.remove('tour-highlight');
        }
    }

    function showStep(step) {
        const tourStep = tourSteps[step];
        
        // Atualizar conteúdo
        tourTitle.textContent = tourStep.title;
        tourText.textContent = tourStep.text;
        
        // Esconder todos os elementos visuais especiais
        document.getElementById('tour-cell-interaction').style.display = 'none';
        document.getElementById('tour-success-fail').style.display = 'none';
        document.getElementById('tour-chance-system').style.display = 'none';
        
        // Mostrar elementos visuais específicos para cada etapa
        if (step === 4) { // Etapa de interação com células
            document.getElementById('tour-cell-interaction').style.display = 'block';
        } else if (step === 5) { // Etapa de sucesso/falha
            document.getElementById('tour-success-fail').style.display = 'block';
        } else if (step === 6) { // Etapa do sistema de chance
            document.getElementById('tour-chance-system').style.display = 'block';
        }
        
        // Atualizar navegação
        tourPrev.style.visibility = step > 0 ? 'visible' : 'hidden';
        tourNext.style.visibility = step < tourSteps.length - 1 ? 'visible' : 'hidden';
        tourProgress.textContent = `${step + 1}/${tourSteps.length}`;
        
        // Destacar elemento
        const highlighted = document.querySelector('.tour-highlight');
        if (highlighted) {
            highlighted.classList.remove('tour-highlight');
        }
        
        if (tourStep.element) {
            const element = document.querySelector(tourStep.element);
            if (element) {
                element.classList.add('tour-highlight');
                
                // Scroll o elemento para a visualização se necessário
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});