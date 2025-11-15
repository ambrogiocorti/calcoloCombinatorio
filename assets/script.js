function fatt(n) {
    n = BigInt(n);
    let r = 1n;
    for (let i = 2n; i <= n; i++) r *= i;
    return r;
}

function toggleParola() {
    let ordine = document.getElementById("ordine").checked;
    let rip = document.getElementById("rip").checked;
    let n = Number(document.getElementById("n").value);
    let k = Number(document.getElementById("k").value);

    if (ordine && rip && n === k && n > 0) {
        document.getElementById("parolaBox").style.display = "block";
    } else {
        document.getElementById("parolaBox").style.display = "none";
    }
}

function validaParola() {
    let p = document.getElementById("parola");
    let val = p.value.toUpperCase();

    val = val.replace(/[^A-Z]/g, "");

    p.value = val;
}

function calcola() {
    let ordine = document.getElementById("ordine").checked;
    let rip = document.getElementById("rip").checked;
    let n = Number(document.getElementById("n").value);
    let k = Number(document.getElementById("k").value);
    let parola = document.getElementById("parola").value.trim().toUpperCase();
    let ris = document.getElementById("ris");

    if (n < 0 || k < 0) {
        ris.innerHTML = "Valori non validi";
        return;
    }

    if (ordine && rip && n === k && parola.length === n) {
        let cont = {};
        for (let c of parola) {
            cont[c] = (cont[c] || 0) + 1;
        }

        let haRipetizioni = Object.values(cont).some(v => v > 1);

        if (!haRipetizioni) {
            ris.innerHTML = `
            <span class="error">
                ERRORE: Hai selezionato "ripetizione", ma la parola non contiene ripetizioni.
            </span>
        `;
            return;
        }

        let numeratore = fatt(n);
        let denominatore = 1n;

        for (let key in cont) {
            denominatore *= fatt(cont[key]);
        }

        let valore = numeratore / denominatore;

        let dett = Object.entries(cont)
            .map(e => `${e[0]}=${e[1]}`)
            .join(", ");

        ris.innerHTML = `
        Permutazioni con ripetizione:<br>
        Pᵣ = n! / (r₁! r₂! ... )<br>
        Ripetizioni: ${dett}<br>
        Risultato = <b>${valore}</b>
    `;
        return;
    }

    let valore, formula;

    if (ordine) {
        if (!rip) {
            if (k === n) {
                valore = fatt(n);
                formula = `Permutazioni senza ripetizione Pₙ = n! = ${valore}`;
            } else if (k < n) {
                valore = fatt(n) / fatt(n - k);
                formula = `Disposizioni senza ripetizione D(n,k)=n!/(n-k)! = ${valore}`;
            } else {
                formula = "<span class='error'>k non può essere maggiore di n senza ripetizione.</span>";
            }
        } else {
            valore = BigInt(n) ** BigInt(k);
            formula = `Disposizioni con ripetizione Dᵣ(n,k)=nᵏ = ${valore}`;
        }
    } else {
        if (!rip) {
            if (k <= n) {
                valore = fatt(n) / (fatt(k) * fatt(n - k));
                formula = `Combinazioni C(n,k)=n!/(k!(n-k)!) = ${valore}`;
            } else {
                formula = "<span class='error'>k non può essere maggiore di n senza ripetizione.</span>";
            }
        } else {
            valore = fatt(n + k - 1) / (fatt(k) * fatt(n - 1));
            formula = `Combinazioni con ripetizione Cᵣ(n,k)= (n+k-1)! / (k!(n-1)!) = ${valore}`;
        }
    }

    ris.innerHTML = formula;

}
