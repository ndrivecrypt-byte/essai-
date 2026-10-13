let budget = {
    revenu: parseFloat(localStorage.getItem('assetflow_revenu')) || 3000,
    limites: { besoins: 0, envies: 0, epargne: 0 },
    depenses: { besoins: 0, envies: 0, epargne: 0 }
};

let listeDesDepenses = JSON.parse(localStorage.getItem('assetflow_depenses')) || [];
let budgetChart;

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    document.getElementById('revenu-total').value = budget.revenu;
    initChart();
    listeDesDepenses.forEach(d => creerLigneTableau(d));
    majAffichage();
});

function initChart() {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Charges Fixes', 'Variables', 'Épargne'],
            datasets: [{
                data:,
                backgroundColor: ['#e4e4e7', '#a1a1aa', '#3f3f46'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '82%'
        }
    });
}

function majAffichage() {
    budget.limites.besoins = budget.revenu * 0.5;
    budget.limites.envies = budget.revenu * 0.3;
    budget.limites.epargne = budget.revenu * 0.2;

    budget.depenses = { besoins: 0, envies: 0, epargne: 0 };
    let totalDepense = 0;

    listeDesDepenses.forEach(d => {
        if(budget.depenses[d.categorie] !== undefined) {
            budget.depenses[d.categorie] += d.montant;
            totalDepense += d.montant;
        }
    });

    // Reste à vivre
    const resteAVivre = budget.revenu - totalDepense;
    const ravEl = document.getElementById('reste-a-vivre');
    ravEl.textContent = resteAVivre.toLocaleString('fr-FR', { minimumFractionDigits: 2 });
    
    // Alerte couleur Reste à vivre
    if (resteAVivre < 0) {
        ravEl.className = "text-xl font-bold tracking-tight text-red-400 font-mono";
    } else {
        ravEl.className = "text-xl font-bold tracking-tight text-zinc-100 font-mono";
    }

    // Affichage des plafonds et débits
    ['besoins', 'envies', 'epargne'].forEach(cat => {
        document.getElementById(`limite-${cat}`).textContent = budget.limites[cat].toFixed(0);
        document.getElementById(`depense-${cat}`).textContent = budget.depenses[cat].toLocaleString('fr-FR', {minimumFractionDigits: 2});
        ajusterBarreMetrique(cat);
    });

    if (budgetChart) {
        budgetChart.data.datasets[0].data = [
            budget.depenses.besoins,
            budget.depenses.envies,
            budget.depenses.epargne
        ];
        budgetChart.update();
    }
}

function ajusterBarreMetrique(cat) {
    const barre = document.getElementById(`barre-${cat}`);
    const pct = budget.limites[cat] > 0 ? (budget.depenses[cat] / budget.limites[cat]) * 100 : 0;
    barre.style.width = Math.min(pct, 100) + '%';

    if (pct > 100) {
        barre.className = "bg-red-400 h-full rounded-full transition-all";
    } else if (pct > 85) {
        barre.className = "bg-amber-500 h-full rounded-full transition-all";
    } else {
        barre.className = "bg-zinc-300 h-full rounded-full transition-all";
    }
}

document.getElementById('btn-calculer').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('revenu-total').value);
    if (!isNaN(val) && val >= 0) {
        budget.revenu = val;
        localStorage.setItem('assetflow_revenu', val);
        majAffichage();
    }
});

document.getElementById('form-depense').addEventListener('submit', (e) => {
    e.preventDefault();
    const nom = document.getElementById('depense-nom').value;
    const montant = parseFloat(document.getElementById('depense-montant').value);
    const categorie = document.getElementById('depense-categorie').value;

    const transaction = { id: Date.now(), nom, montant, categorie };
    listeDesDepenses.push(transaction);
    localStorage.setItem('assetflow_depenses', JSON.stringify(listeDesDepenses));

    creerLigneTableau(transaction);
    document.getElementById('form-depense').reset();
    majAffichage();
});

function creerLigneTableau(d) {
    const tbody = document.getElementById('liste-depenses');
    const tr = document.createElement('tr');
    tr.dataset.id = d.id;
    tr.className = "hover:bg-zinc-900/60 transition text-zinc-300";

    const labels = { 
        besoins: '<span class="text-zinc-400 font-mono text-[10px] bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 rounded">Fixe</span>', 
        envies: '<span class="text-zinc-400 font-mono text-[10px] bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 rounded">Variable</span>', 
        epargne: '<span class="text-zinc-400 font-mono text-[10px] bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 rounded">Actif</span>' 
    };

    tr.innerHTML = `
        <td class="p-4 font-medium text-zinc-200">${d.nom}</td>
        <td class="p-4">${labels[d.categorie]}</td>
        <td class="p-4 text-right font-mono text-zinc-200">-${d.montant.toFixed(2)} €</td>
        <td class="p-4 text-center">
            <button onclick="supprimer(${d.id})" class="text-zinc-600 hover:text-zinc-400 transition p-1">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
    lucide.createIcons();
}

window.supprimer = function(id) {
    listeDesDepenses = listeDesDepenses.filter(d => d.id !== id);
    localStorage.setItem('assetflow_depenses', JSON.stringify(listeDesDepenses));
    const ligne = document.querySelector(`tr[data-id="${id}"]`);
    if(ligne) ligne.remove();
    majAffichage();
};
