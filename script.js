document.addEventListener('DOMContentLoaded', function() {
    // Função para verificar se a seção está visível
    function checkVisibility() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                section.classList.add('visible');
            }
        });
    }

    // Adiciona a visibilidade ao carregar a página e ao rolar a página
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();

    // Função para obter a localização do usuário e ajustar a contagem regressiva e hora do evento
    function getLocationAndAdjustTime() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Chave da API do Google Time Zone
                const apiKey = 'AIzaSyALAygsesAfdHrlCuG-N56rgcuP-X3Pf0Y';
                const timestamp = Math.floor(Date.now() / 1000);

                fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "OK") {
                            const userOffset = data.dstOffset + data.rawOffset;
                            const weddingDate = new Date("July 13, 2024 13:00:00").getTime();
                            const adjustedWeddingDate = weddingDate - userOffset * 1000;

                            countdown(adjustedWeddingDate);
                            setInterval(() => countdown(adjustedWeddingDate), 1000);
                            updateEventDetails(adjustedWeddingDate);
                        } else {
                            console.error('Error fetching timezone data:', data.errorMessage);
                            const weddingDate = new Date("July 13, 2024 13:00:00").getTime();
                            countdown(weddingDate);
                            setInterval(() => countdown(weddingDate), 1000);
                            updateEventDetails(weddingDate);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching timezone data:', error);
                        const weddingDate = new Date("July 13, 2024 13:00:00").getTime();
                        countdown(weddingDate);
                        setInterval(() => countdown(weddingDate), 1000);
                        updateEventDetails(weddingDate);
                    });
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
            const weddingDate = new Date("July 13, 2024 13:00:00").getTime();
            countdown(weddingDate);
            setInterval(() => countdown(weddingDate), 1000);
            updateEventDetails(weddingDate);
        }
    }

    // Função de Contagem Regressiva
    function countdown(targetDate) {
        const now = new Date().getTime();
        const gap = targetDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.getElementById("days").innerText = textDay;
        document.getElementById("hours").innerText = textHour;
        document.getElementById("minutes").innerText = textMinute;
        document.getElementById("seconds").innerText = textSecond;
    }

    // Função para atualizar os detalhes do evento com a hora ajustada
    function updateEventDetails(adjustedWeddingDate) {
        const eventDate = new Date(adjustedWeddingDate);
        const eventTimeString = eventDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});

        const eventTimeElement = document.querySelector('.details-card .event-time');
        if (eventTimeElement) {
            eventTimeElement.innerText = `${translations[currentLang]['time']} ${eventTimeString}`;
        }
    }

    // Função para trocar o idioma do site
    const translations = {
        pt: {
            home: 'Início',
            story: 'Nossa História',
            details: 'Detalhes do Evento',
            live: 'Transmissão ao Vivo',
            rsvp: 'RSVP',
            countdown: 'Contagem Regressiva',
            days: 'dias',
            hours: 'horas',
            minutes: 'minutos',
            seconds: 'segundos',
            storyTitle: 'Nossa História',
            storyText1: 'Nos conhecemos de uma maneira bem moderna: por um aplicativo de aprendizado de inglês. A conexão foi instantânea, e passamos meses conversando e nos conhecendo melhor. Depois de muitas conversas e trocas de mensagens, finalmente marcamos nosso primeiro encontro, que aconteceu em um lugar especial - o aeroporto. Foi lá que nossas almas, que pareciam pertencer uma à outra, finalmente se encontraram. A primeira impressão um do outro foi simplesmente maravilhosa.',
            storyText2: 'A primeira lembrança marcante que temos juntos é o nosso grande encontro no aeroporto. Após meses de espera, quando ele finalmente veio me conhecer pessoalmente, foi um momento inesquecível. Sentimo-nos no céu, como se nossas almas finalmente tivessem se encontrado. Aquela sensação de pertencimento e completude era algo que nunca tínhamos experimentado antes.',
            storyText3: 'Nossa transição de namorados para noivos foi igualmente especial. Ele preparou tudo com muito carinho e atenção. Me levou à Avenida Paulista, um dos lugares mais icônicos de São Paulo, e no topo de um arranha-céu, ele se ajoelhou e fez o pedido. Foi um momento mágico que selou nosso compromisso de passar a vida juntos.',
            storyText4: 'Percebemos que queríamos estar juntos para sempre no momento em que nos despedimos pela primeira vez no aeroporto. A despedida foi horrível, mas também foi um momento decisivo. Nosso relacionamento, que foi construído à distância, nos ensinou o valor da comunicação e do companheirismo. A distância, nossa maior adversária, acabou sendo a grande fortalecedora da nossa relação. Cada conversa e cada momento juntos, mesmo que virtual, fortaleceu o nosso laço e nos preparou para o futuro que queríamos construir lado a lado.',
            detailsTitle: 'Detalhes do Evento',
            date: 'Data: 13 de Julho, 2024',
            time: 'Hora:',
            location: 'Local: Beulah Baptist Church',
            liveTitle: 'Transmissão ao Vivo',
            rsvpTitle: 'RSVP',
            rsvpText: 'Por favor, confirme sua presença enviando um e-mail para'
        },
        en: {
            home: 'Home',
            story: 'Our Story',
            details: 'Event Details',
            live: 'Live Stream',
            rsvp: 'RSVP',
            countdown: 'Countdown',
            days: 'days',
            hours: 'hours',
            minutes: 'minutes',
            seconds: 'seconds',
            storyTitle: 'Our Story',
            storyText1: 'We met in a very modern way: through a language learning app. The connection was instant, and we spent months talking and getting to know each other better. After many conversations and message exchanges, we finally arranged our first meeting, which took place in a special place - the airport. It was there that our souls, which seemed to belong to each other, finally met. The first impression of each other was simply wonderful.',
            storyText2: 'The first remarkable memory we have together is our great meeting at the airport. After months of waiting, when he finally came to meet me in person, it was an unforgettable moment. We felt in heaven, as if our souls had finally met. That feeling of belonging and completeness was something we had never experienced before.',
            storyText3: 'Our transition from dating to engagement was equally special. He prepared everything with great care and attention. He took me to Avenida Paulista, one of the most iconic places in São Paulo, and on top of a skyscraper, he knelt down and proposed. It was a magical moment that sealed our commitment to spend our lives together.',
            storyText4: 'We realized we wanted to be together forever the moment we said goodbye for the first time at the airport. The farewell was terrible, but it was also a decisive moment. Our relationship, which was built at a distance, taught us the value of communication and companionship. The distance, our greatest adversary, ended up being the great strengthener of our relationship. Every conversation and every moment together, even virtually, strengthened our bond and prepared us for the future we wanted to build side by side.',
            detailsTitle: 'Event Details',
            date: 'Date: July 13, 2024',
            time: 'Time:',
            location: 'Location: Beulah Baptist Church',
            liveTitle: 'Live Stream',
            rsvpTitle: 'RSVP',
            rsvpText: 'Please confirm your attendance by sending an email to'
        }
    };

    let currentLang = 'pt';

    window.setLanguage = function(lang) {
        currentLang = lang;
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            element.innerText = translations[lang][key];
        });

        // Atualizar o tempo do evento
        getLocationAndAdjustTime();
    }

    // Inicializar o idioma padrão
    setLanguage(currentLang);

    // Chamar a função para obter a localização e ajustar a contagem regressiva e hora do evento
    getLocationAndAdjustTime();

    // Função para inicializar o mapa do Google Maps
    window.initMap = function() {
        var churchLocation = {lat: 35.518664, lng: -79.567136};
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: churchLocation,
        });
        new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: churchLocation,
        });
    };

    // Função para fechar lightbox ao clicar fora da imagem
    function closeLightbox(event) {
        if (event.target.classList.contains('lightbox')) {
            event.target.style.display = 'none';
        }
    }

    // Adiciona evento de clique para fechar lightbox
    const lightboxes = document.querySelectorAll('.lightbox');
    lightboxes.forEach(lightbox => {
        lightbox.addEventListener('click', closeLightbox);
    });

    // Função para fechar lightbox ao pressionar a tecla "Esc"
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            lightboxes.forEach(lightbox => {
                lightbox.style.display = 'none';
            });
        }
    });

    // Função para rotação automática da galeria de fotos
    const track = document.querySelector('.gallery-track');
    const slides = Array.from(track.children);

    // Clonar os primeiros e últimos elementos para criar o efeito infinito
    slides.forEach(slide => {
        const cloneFirst = slide.cloneNode(true);
        const cloneLast = slide.cloneNode(true);
        track.appendChild(cloneFirst);
        track.insertBefore(cloneLast, track.firstChild);
    });

    let index = 0;
    const totalSlides = slides.length;
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * totalSlides}px)`;

    const moveToNextSlide = () => {
        index++;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${(totalSlides + index) * slideWidth}px)`;

        if (index >= totalSlides) {
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = `translateX(-${totalSlides * slideWidth}px)`;
                index = 0;
            }, 500);
        }
    };

    setInterval(moveToNextSlide, 3000); // Muda de imagem a cada 3 segundos
});