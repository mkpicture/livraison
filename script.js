// Initialiser les données depuis le Local Storage
document.addEventListener('DOMContentLoaded', afficherRevenu);
document.addEventListener('DOMContentLoaded', afficherLivraisons);

document.getElementById("livraisonForm").onsubmit = (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const client_nom = document.getElementById("client_nom").value;
    const client_telephone = document.getElementById("client_telephone").value;
    const adresse = document.getElementById("adresse").value;
    const montant = parseFloat(document.getElementById("montant").value);
    const moyen_paiement = document.getElementById("moyen_paiement").value;
    const statut = document.getElementById("statut").value;

    const livraison = { date, client_nom, client_telephone, adresse, montant, moyen_paiement, statut };

    let livraisons = JSON.parse(localStorage.getItem("livraisons")) || [];
    livraisons.push(livraison);
    localStorage.setItem("livraisons", JSON.stringify(livraisons));

    afficherNotification("Livraison enregistrée avec succès !");
    document.getElementById("livraisonForm").reset();

    afficherRevenu();
    afficherLivraisons();
};

// Affiche le revenu journalier total
function afficherRevenu() {
    const today = new Date().toISOString().split('T')[0];
    let livraisons = JSON.parse(localStorage.getItem("livraisons")) || [];
    const revenuJournalier = livraisons
        .filter(livraison => livraison.date === today && livraison.statut === "Livrée")
        .reduce((total, livraison) => total + livraison.montant, 0);

    document.getElementById("revenuJournalier").textContent = `${revenuJournalier} €`;
}

// Affiche toutes les livraisons du jour
function afficherLivraisons() {
    const today = new Date().toISOString().split('T')[0];
    const livraisons = JSON.parse(localStorage.getItem("livraisons")) || [];
    const livraisonsDuJour = livraisons.filter(livraison => livraison.date === today);

    const livraisonsBody = document.getElementById("livraisonsBody");
    livraisonsBody.innerHTML = "";

    livraisonsDuJour.forEach((livraison, index) => {
        const row = livraisonsBody.insertRow();
        row.innerHTML = `
            <td>${livraison.date}</td>
            <td>${livraison.client_nom}</td>
            <td>${livraison.adresse}</td>
            <td>${livraison.client_telephone}</td>
            <td>${livraison.montant} €</td>
            <td>${livraison.moyen_paiement}</td>
            <td>${livraison.statut}</td>
            <td><button class="btn-action" onclick="changerStatut(${index})">Marquer comme Livrée</button></td>
        `;
    });
}

// Fonction pour changer le statut de la livraison
function changerStatut(index) {
    let livraisons = JSON.parse(localStorage.getItem("livraisons")) || [];
    if (livraisons[index].statut !== "Livrée") {
        livraisons[index].statut = "Livrée";
        localStorage.setItem("livraisons", JSON.stringify(livraisons));
        afficherNotification("Statut mis à jour en 'Livrée'");
        afficherRevenu();
        afficherLivraisons();
    }
}

// Affiche une notification avec animation
function afficherNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}
