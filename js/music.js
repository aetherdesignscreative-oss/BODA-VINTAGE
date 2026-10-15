/* REPRODUCTOR MUSICAL */
window.WeddingMusic = {
    audio: new Audio(),
    selectedIndex: -1,
    playing: false,

    init() {
        this.audio.loop = true;
        this.audio.preload = "none";
        this.renderSongs();

        this.audio.addEventListener("play", () => {
            this.playing = true;
            this.updateControls();
        });

        this.audio.addEventListener("pause", () => {
            this.playing = false;
            this.updateControls();
        });

        this.audio.addEventListener("error", () => {
            App.toast("No se pudo reproducir el archivo. Comprueba que el MP3 exista en assets/music.");
        });

        document.getElementById("music-toggle").addEventListener("click", () => {
            this.toggle();
        });
    },

    renderSongs() {
        const list = document.getElementById("song-list");
        list.replaceChildren();

        WEDDING.songs.forEach((song, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "song-option";
            button.innerHTML = `
                <span class="song-number">${String(index + 1).padStart(2, "0")}</span>
                <span class="song-info">
                    <strong></strong>
                    <small></small>
                </span>
                <span class="song-play" aria-hidden="true">♫</span>
            `;

            button.querySelector("strong").textContent = song.title;
            button.querySelector("small").textContent = song.artist;
            button.addEventListener("click", () => this.select(index));
            list.appendChild(button);
        });
    },

    async select(index) {
        const song = WEDDING.songs[index];
        if (!song) return;

        this.selectedIndex = index;
        this.audio.src = `assets/music/${song.file}`;
        this.audio.load();

        document.querySelectorAll(".song-option").forEach((button, i) => {
            button.classList.toggle("selected", i === index);
            button.querySelector(".song-play").textContent =
                i === index ? "♫" : "＋";
        });

        try {
            await this.audio.play();
        } catch {
            App.toast("No se pudo iniciar la canción. Comprueba el archivo MP3 e inténtalo de nuevo.");
        }

        this.updateControls();
    },

    async toggle() {
        if (this.playing) {
            this.audio.pause();
        } else if (this.selectedIndex >= 0) {
            try {
                await this.audio.play();
            } catch {
                App.toast("Selecciona una canción disponible para reproducir.");
            }
        } else {
            App.toast("Elige primero una canción en el menú musical.");
            App.navigate("music");
        }
    },

    updateControls() {
        const button = document.getElementById("music-toggle");
        button.classList.toggle("is-playing", this.playing);
        button.textContent = this.playing ? "Ⅱ" : "♫";
        button.setAttribute("aria-label", this.playing ? "Pausar música" : "Reproducir música");
        button.title = this.playing ? "Pausar música" : "Reproducir música";
    }
};
