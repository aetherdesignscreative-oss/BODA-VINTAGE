/* CONFIRMACION PERSONALIZADA Y TARJETA PNG */
window.WeddingRSVP = {
    guest: null,

    init() {
        const form = document.getElementById("rsvp-form");
        if (!form) {
            console.error("No se encuentra #rsvp-form en index.html");
            return;
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            const data = new FormData(form);
            const name = String(data.get("name") || "").trim();
            const attendance = String(data.get("attendance") || "");
            const guests = String(data.get("guests") || "1");
            const message = String(data.get("message") || "").trim();

            if (!name || !attendance) {
                App.toast("Completa tu nombre y tu respuesta.");
                return;
            }

            this.guest = { name, attendance, guests, message };
            this.showThanks();
        });

        document.getElementById("share-confirmation")
            .addEventListener("click", () => this.share());

        document.getElementById("download-card")
            .addEventListener("click", () => this.download());

        document.getElementById("edit-confirmation")
            .addEventListener("click", () => {
                document.getElementById("thanks-screen").classList.remove("active");
                document.getElementById("thanks-screen").setAttribute("aria-hidden", "true");
                WeddingNavigation.navigate("rsvp");
            });
    },

    showThanks() {
        const g = this.guest;
        const accepted = g.attendance.toLowerCase().startsWith("sí");

        document.getElementById("thanks-heading").textContent =
            accepted ? "Gracias por acompañarnos" : "Gracias por avisarnos";

        document.getElementById("thanks-message").textContent = accepted
            ? "Gracias por compartir con nosotros la alegría de este momento tan especial. Nos sentimos felices de saber que formas parte de nuestra historia y de poder celebrar contigo el comienzo de esta nueva etapa."
            : "Muchas gracias por hacernos saber tu respuesta. Aunque no puedas acompañarnos, agradecemos de corazón tus buenos deseos y el cariño que compartes con nosotros en este momento tan especial.";

        document.getElementById("thanks-guest").textContent = g.name;
        document.getElementById("thanks-attendance").textContent = g.attendance;
        document.getElementById("thanks-guests").textContent =
            `Número de invitados: ${g.guests}`;

        document.getElementById("thanks-status").textContent = "";

        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
            screen.setAttribute("aria-hidden", "true");
        });

        const thanks = document.getElementById("thanks-screen");
        thanks.classList.add("active");
        thanks.setAttribute("aria-hidden", "false");

        document.getElementById("music-toggle")?.classList.remove("visible");
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    getMessage() {
        const g = this.guest;
        const accepted = g.attendance.toLowerCase().startsWith("sí");

        return [
            `Confirmación de asistencia — Boda de ${WEDDING.bride} y ${WEDDING.groom}`,
            "",
            `Nombre: ${g.name}`,
            `Respuesta: ${g.attendance}`,
            `Número de invitados: ${g.guests}`,
            g.message ? `Mensaje para los novios: ${g.message}` : "",
            "",
            accepted
                ? "Gracias por esta invitación tan especial. ¡Nos vemos en la boda!"
                : "Gracias por compartir esta invitación con nosotros."
        ].filter(Boolean).join("\n");
    },

    async createCard() {
        if (!this.guest) throw new Error("Primero completa la confirmación.");

        const g = this.guest;
        const accepted = g.attendance.toLowerCase().startsWith("sí");
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1350;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#4b0718";
        ctx.fillRect(0, 0, 1080, 1350);

        ctx.strokeStyle = "#b29a7d";
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 35, 1010, 1280);
        ctx.strokeRect(51, 51, 978, 1248);

        ctx.textAlign = "center";
        ctx.fillStyle = "#f6f0eb";

        ctx.font = "20px Georgia";
        ctx.letterSpacing = "5px";
        ctx.fillText("INVITACION DE BODA", 540, 145);

        ctx.font = "100px Georgia";
        ctx.fillText(`${WEDDING.initials[0]}  &  ${WEDDING.initials[1]}`, 540, 340);

        ctx.strokeStyle = "#b29a7d";
        ctx.beginPath();
        ctx.moveTo(390, 395);
        ctx.lineTo(690, 395);
        ctx.stroke();

        ctx.font = "38px Georgia";
        ctx.fillText(WEDDING.bride, 540, 470);
        ctx.font = "italic 30px Georgia";
        ctx.fillText("&", 540, 520);
        ctx.font = "38px Georgia";
        ctx.fillText(WEDDING.groom, 540, 570);

        ctx.font = "25px Georgia";
        ctx.fillStyle = "#e4cfc5";
        ctx.fillText("CONFIRMACION DE ASISTENCIA", 540, 680);

        ctx.font = "italic 42px Georgia";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(g.name, 540, 780, 850);

        ctx.font = "29px Georgia";
        ctx.fillStyle = "#e4cfc5";
        ctx.fillText(
            accepted ? "Nos acompañará en este día especial" : "Ha comunicado su respuesta",
            540, 865, 850
        );

        ctx.font = "27px Georgia";
        ctx.fillText(`Invitados: ${g.guests}`, 540, 930);

        ctx.strokeStyle = "#b29a7d";
        ctx.beginPath();
        ctx.moveTo(300, 1000);
        ctx.lineTo(780, 1000);
        ctx.stroke();

        ctx.font = "italic 36px Georgia";
        ctx.fillStyle = "#f6f0eb";
        ctx.fillText("Con cariño,", 540, 1080);
        ctx.font = "35px Georgia";
        ctx.fillText(`${WEDDING.bride} & ${WEDDING.groom}`, 540, 1140);

        ctx.font = "18px Georgia";
        ctx.fillStyle = "#d8b9aa";
        ctx.fillText(WEDDING.date || "", 540, 1220);

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (blob) resolve(new File([blob], "confirmacion-boda.png", {
                    type: "image/png"
                }));
                else reject(new Error("No se pudo generar la tarjeta."));
            }, "image/png");
        });
    },

    async download() {
        const status = document.getElementById("thanks-status");
        try {
            const file = await this.createCard();
            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1500);
            status.textContent = "Tarjeta descargada. Ya puedes compartirla por WhatsApp.";
        } catch (error) {
            status.textContent = error.message;
        }
    },

    async share() {
        const status = document.getElementById("thanks-status");
        const number = String(WEDDING.whatsapp || "").replace(/\D/g, "");
        const text = this.getMessage();

        try {
            const file = await this.createCard();

            if (navigator.share && navigator.canShare &&
                navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Confirmación de boda",
                    text,
                    files: [file]
                });
                status.textContent =
                    "Si elegiste WhatsApp, comprueba que la tarjeta y el mensaje estén incluidos antes de enviarlos.";
                return;
            }

            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1500);

            if (!number) {
                status.textContent =
                    "Tarjeta descargada. Configura el WhatsApp en js/config.js para preparar el mensaje.";
                return;
            }

            status.textContent =
                "Tarjeta descargada. Se abrirá WhatsApp con el mensaje preparado; adjunta la tarjeta descargada antes de enviarlo.";

            window.open(
                `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
                "_blank",
                "noopener,noreferrer"
            );
        } catch (error) {
            if (error.name === "AbortError") {
                status.textContent = "No se compartió la tarjeta.";
            } else {
                status.textContent =
                    "No se pudo compartir automáticamente. Usa DESCARGAR TARJETA PNG.";
            }
        }
    }
};
