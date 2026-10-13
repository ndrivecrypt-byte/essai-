// Données de l'application
let budget = {
    revenu: 2000,
    limites: { besoins: 1000, envies: 600, epargne: 400 },
    depenses: { besoins: 0, envies: 0, epargne: 0 }
};

let listeDesDepenses = [];

// Éléments HTML
const revenuInput = document.getElementById('revenu-total');
const btnCalculer = document.getElementById('btn-calculer');
const formDepense = document.getElementById('form-depense');
const listeDepensesHTML = document.getElementById('liste-depenses');

// Mettre à jour l'affichage complet du budget
function majAffichage() {
    // Calcul des limites théoriques (50 / 30 / 20)
    budget.limites.besoins = budget.revenu * 0.5;
    budget.limites.envies = budget.revenu * 0.3;
    budget.limites.epargne = budget.revenu * 0.2;

    // Réinitialiser les totaux de dépenses
    budget.depenses.besoins = 0;
    budget.depenses.envies = 0;
    budget.depenses.epargne = 0;

    // Calculer la somme par catégorie
    listeDesDepenses.forEach(d => {
        budget.depenses[d.categorie] += d.montant;
    });

    // Mettre à jour les textes des limites et dépenses
    document.getElementById('limite-besoins').textContent = budget.limites.besoins.toFixed(0);
    document.getElementById('limite-envies').textContent = budget.limites.envies.toFixed(0);
    document.getElementById('limite-epargne').textContent = budget.limites.epargne.toFixed(0);

    document.getElementById('depense-besoins').textContent = budget.depenses.besoins.toFixed(2);
    document.getElementById('depense-envies').textContent = budget.depenses.envies.toFixed(2);
    document.getElementById('depense-epargne').textContent = budget.depenses.epargne.toFixed(2);

    // Mettre à jour visuellement les barres de progression
    calculerBarre('besoins', 'barre-besoins');
    calculerBarre('envies', 'barre-envies');
    calculerBarre('epargne', 'barre-epargne');
}

function calculerBarre(cat, elementId) {
    const barre = document.getElementById(elementId);
    const pourcentage = (budget.depenses[cat] / budget.limites[cat]) * 100;
    
    // Bloquer le visuel à 100% maximum si on dépasse
    barre.style.width = Math.min(pourcentage, 100) + '%';

    // Changer de couleur si le budget de la catégorie est dépassé
    if (pourcentage > 100) {
        barre.style.backgroundColor = '#ef4444'; // Rouge danger
    } else if (pourcentage > 85) {
        barre.style.backgroundColor = '#f59e0b'; // Orange attention
    } else {
        barre.style.backgroundColor = '#22c55e'; // Vert normal
    }
}

// Événement : Modifier le revenu de base
btnCalculer.addEventListener('click', () => {
    const valeur = parseFloat(revenuInput.value);
    if (!isNaN(valeur) && valeur >= 0) {
        budget.revenu = valeur;
        majAffichage();
    }
});

// Événement : Soumission du formulaire (Ajouter une dépense)
formDepense.addEventListener('submit', (e) => {
    e.preventDefault();

    const nom = document.getElementById('depense-nom').value;
    const montant = parseFloat(document.getElementById('depense-montant').value);
    const categorie = document.getElementById('depense-categorie').value;

    const nouvelleDepense = {
        id: Date.now(),
        nom: nom,
        montant: montant,
        categorie: categorie
    };

    listeDesDepenses.push(nouvelleDepense);
    
    // Ajouter la ligne au tableau HTML
    creerLigneTableau(nouvelleDepense);

    // Réinitialiser le formulaire
    formDepense.reset();
    majAffichage();
});

function creerLigneTableau(depense) {
    const tr = document.createElement('tr');
    tr.dataset.id = depense.id;

    // Traduction propre pour le tableau
    const nomsCategories = { besoins: '🔴 Besoin', envies: '🔵 Envie', epargne: '🟢 Épargne' };

    tr.innerHTML = `
        <td>${depense.nom}</td>
        <td>${nomsCategories[depense.categorie]}</td>
        <td>${depense.montant.toFixed(2)} €</td>
        <td><button class="btn-delete" onclick="supprimerDepense(${depense.id})">Supprimer</button></td>
    `;
    listeDepensesHTML.appendChild(tr);
}

// Fonction globale pour supprimer une ligne
window.supprimerDepense = function(id) {
    listeDesDepenses = listeDesDepenses.filter(d => d.id !== id);
    const ligne = document.querySelector(`tr[data-id="${id}"]`);
    if (ligne) ligne.remove();
    majAffichage();
};

// Initialisation au premier chargement
majAffichage();
