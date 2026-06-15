// Mini-libreria — Settimana VII Giorno I
//
// Devi fare 4 cose:
// 1. Definire una classe Libro (titolo, autore, anno, letto)
// 2. Definire una classe LibroDigitale che estende Libro (aggiunge formato, dimensioneMb)
// 3. Aggiungere un listener al form che crea una nuova istanza e la aggiunge all'array
// 4. Renderizzare la lista nel <ul id="lista-libri"> via innerHTML
//
// Bonus: bottone "Segna come letto" su ogni elemento, gestito con event delegation.



// LE CLASSI


class Libro {
    static contatore = 0;
    
    constructor(_titolo, _autore, _anno) {
        this.id = ++Libro.contatore;
        this.titolo = _titolo;
        this.autore = _autore;
        this.anno = _anno;
        this.letto = false;
    }

    segnaComeLetto() {
        return this.letto = true;
    }

    formato() {
        return `cartaceo`;
    }
}

class LibroDigitale extends Libro {
    constructor(_titolo, _autore, _anno, _dimensioneMb) {
        super(_titolo, _autore, _anno);
        this.dimensioneMb = _dimensioneMb;
    }

    formato() {
        return `digitale (${this.dimensioneMb} MB)`;
    }
}

// ARRAY DEI LIBRI

const Libri = [];

// RENDER

function renderLibri() {
    const htmlLibri = Libri.map(l => {
        const classeLetto = l.letto ? "letto" : "";
        const testoBottone = l.letto === false ? "Segna come letto" : "✅";

        return `
            <li class="${classeLetto}" data-id="${l.id}">
                <div class="info">
                    <strong>${l.titolo}</strong>
                    <span class="badge-formato">${l.formato()}</span>
                    <p class="meta">di ${l.autore} (${l.anno})</p>
                </div>
                <div class="azioni">
                    <button data-azione="leggi">${testoBottone}</button>
                </div>
            </li>
        `;
    }).join("");

    document.getElementById("lista-libri").innerHTML = htmlLibri;

    document.getElementById("contatore").textContent = Libri.length;
}

// EVENT LISTENERS

const selectFormato = document.getElementById("formato");
const campoDimensione = document.getElementById("campo-dimensione");

if (selectFormato) {
    selectFormato.addEventListener("change", function () {
        if (selectFormato.value.toLowerCase() === "digitale") {
            campoDimensione.removeAttribute("hidden");
        } else {
            campoDimensione.setAttribute("hidden", "true");
        }
    });
}

// SUBMIT FORM

const formAggiungi = document.getElementById("aggiungi-libro");

if (formAggiungi) {
    formAggiungi.addEventListener("submit", function (e) {
        e.preventDefault();

        const titolo = formAggiungi.querySelector('input[placeholder*="Titolo"]').value;
        const autore = formAggiungi.querySelector('input[placeholder*="Autore"]').value;
        const anno = parseInt(formAggiungi.querySelector('input[placeholder*="Anno"]').value);
        const formatoScelto = selectFormato.value.toLowerCase();

        let nuovoLibro;

        if (formatoScelto === "digitale") {
            const dimensione = parseFloat(campoDimensione.querySelector('input').value);
            nuovoLibro = new LibroDigitale(titolo, autore, anno, dimensione);
        } else {
            nuovoLibro = new Libro(titolo, autore, anno);
        }

        Libri.push(nuovoLibro);
        renderLibri();
        e.target.reset();
        campoDimensione.setAttribute("hidden", "true");
    });
}

// CLICK DELEGATO

const listaLibriElement = document.getElementById("lista-libri");

if (listaLibriElement) {
    listaLibriElement.addEventListener("click", function (e) {
    
        const bottoneLeggi = e.target.closest('[data-azione="leggi"]');
        
        if (!bottoneLeggi) return;

        const tagLi = bottoneLeggi.closest("li");
        const idLibro = parseInt(tagLi.dataset.id);
        const libroTrovato = Libri.find(l => l.id === idLibro);

        if (libroTrovato) {
            libroTrovato.segnaComeLetto(); 
            renderLibri();
        }
    });
}