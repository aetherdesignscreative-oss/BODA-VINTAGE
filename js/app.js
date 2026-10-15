/* INICIALIZACIÓN Y DATOS DE LA INVITACIÓN */
window.App = {
    init() {
        this.applyConfig();
        WeddingAnimations.init();
        WeddingMusic.init();
        WeddingNavigation.init();
        WeddingRSVP.init();

        document.querySelectorAll(".screen").forEach(screen => {
            screen.setAttribute("aria-hidden", screen.classList.contains("active") ? "false" : "true");
        });

        window.setTimeout(() => WeddingAnimations.hideLoader(), 1100);
    },

    applyConfig() {
        const setText = (selector, value) => {
            document.querySelectorAll(selector).forEach(element => {
                element.textContent = value;
            });
        };

        setText('[data-name="bride"]', WEDDING.bride);
        setText('[data-name="groom"]', WEDDING.groom);
        setText("[data-full-date]", WEDDING.date);
        setText("[data-time]", WEDDING.time);
        setText("[data-venue]", WEDDING.venue);
        setText("[data-address]", WEDDING.address);
        setText("#story-text", WEDDING.story);

        document.getElementById("map-link").href = WEDDING.mapUrl;
    },

    toast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(this.toastTimeout);
        this.toastTimeout = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 3800);
    },

    navigate(name) {
        WeddingNavigation.navigate(name);
    }
};

document.addEventListener("DOMContentLoaded", () => App.init());
