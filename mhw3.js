function OnJson(json){
    console.log('json ricevuto');
    const notizie=document.querySelector('#visualizza_notizie');
    notizie.innerHTML='';
    console.log(json);
    const lunghezza=json.news.length;
    console.log(lunghezza);
    let count =0;
    for(let i=0;i<lunghezza;i++){
        console.log(json.news[i]);
        const notizia=json.news[i];
        const data_notizia=notizia.published.substring(11,13);
        console.log(data_notizia);
        const data_input=document.querySelector('#data_notizia');
        const data_value=encodeURIComponent(data_input.value);
        console.log(data_value);
        
        if(data_notizia===data_value){
            count++;
            console.log('Autore corrispondente');
            const title=document.createElement('h2');
            title.textContent=notizia.title;
            const immagine=document.createElement('img');
            immagine.src=notizia.image;
            const descrizione=document.createElement('p');
            descrizione.textContent=notizia.description;

            const contenitore=document.createElement('div');
            contenitore.appendChild(title);
            contenitore.appendChild(immagine);
            contenitore.appendChild(descrizione);

            contenitore.classList.add('item_div_senza_oauth2');

            const spazio=document.querySelector('#visualizza_notizie');
            spazio.appendChild(contenitore);
            
            
        }
        
        
    }
        if(count===0){
            console.log('non ci sono notizie');
            const avviso=document.createElement('p');
            avviso.textContent= 'non ci sono notizie per quest ora';
            notizie.appendChild(avviso);
        }
   
   
}

function onResponse(response){
    
    return response.json();
    
}


function notizie(event){
    event.preventDefault();
    const data_input=document.querySelector('#data_notizia');
    const data_value=encodeURIComponent(data_input.value);

    console.log('sto eseguendo ricarche sulla data '+ data_value);



    var url = 'https://api.currentsapi.services/v1/search?' +
            'keywords=Amazon&language=en&' + 
            'apiKey=FsZLb0Na8wnedQA47K4h6Z_g2vCSB713B7ba9aTQ7WnwClSK';
    var req = new Request(url);
    fetch(req).then(onResponse).then(OnJson);


}



const innesco_notizie=document.querySelector('#notizie_api');
innesco_notizie.addEventListener('submit', notizie);



function generaNumeroCasuale(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


function onJson_Spotify(json){
    console.log('json ricevuto');
    console.log(json);
    
    const limite_ricerche=json.albums.limit;
    
      
    
    const lunghezza = generaNumeroCasuale(1, limite_ricerche);
    console.log("devo ricercare: "+lunghezza+" brani o album su "+limite_ricerche+" disponibili");

    const paragrafo=document.createElement('p');
    paragrafo.textContent='clicca sull immagine per ascoltare l album su spotify';


    const sezione_spotify=document.querySelector('#visualizza_spotify');
    sezione_spotify.innerHTML='';
    const numero_ricerche=document.createElement('p');
    numero_ricerche.classList.add('visualizza_risultati');
    numero_ricerche.textContent='Sto ricercando '+lunghezza+ ' risultati su '+limite_ricerche+' disponibili';
    sezione_spotify.appendChild(numero_ricerche);
    for(let i=0;i<lunghezza;i++){
        const album_corrente=json.albums.items[i];
        const nome_album=document.createElement('a');
        nome_album.classList.add('titolo_spotify');

        const image=document.createElement('img');


        const nome_artisti=document.createElement('div');
        nome_artisti.classList.add('div_di_artisti');

        const data_pubblicazione=document.createElement('p');
        const tipo=document.createElement('p');

        const div_album=document.createElement('div');

        nome_album.textContent=album_corrente.name;
        
        image.src=album_corrente.images[0].url;
        nome_album.href=album_corrente.external_urls.spotify;
        nome_album.target= '_blank';
        const lunghezza_artisti=album_corrente.artists.length;
        for(let j=0;j<lunghezza_artisti;j++){
            const artista_corrente=album_corrente.artists[j];
            const artista_da_inserire=document.createElement('a');
            artista_da_inserire.textContent=artista_corrente.name;
            artista_da_inserire.href=artista_corrente.external_urls.spotify;
            artista_da_inserire.target= '_blank';
            artista_da_inserire.classList.add('artisti_spotify');
            nome_artisti.appendChild(artista_da_inserire);

        }

        data_pubblicazione.textContent='Pubblicazione: '+album_corrente.release_date;
        tipo.textContent='il seguente contenuto è un '+album_corrente.album_type;
        div_album.appendChild(nome_album);
        div_album.appendChild(image);
        div_album.appendChild(nome_artisti);
        div_album.appendChild(data_pubblicazione);
        div_album.appendChild(tipo);
        div_album.classList.add('div_da_visualizzare_oauth2');

        sezione_spotify.appendChild(div_album);



    }

}


function cancella_sezione_spotify(event){
    event.preventDefault();
    const sezione_da_eliminare=document.querySelector('#visualizza_spotify');
    sezione_da_eliminare.innerHTML='';

}

const innesco_cancella=document.querySelector('#pulisci_spotify');
innesco_cancella.addEventListener('click', cancella_sezione_spotify);


function onResponse_Spotify(response){
    
    return response.json();
    
}




function Cerca_brano(event){
    event.preventDefault();
    const input_brano=document.querySelector('#valore_spotify');
    const brano_valore=encodeURIComponent(input_brano.value);

fetch("https://api.spotify.com/v1/search?type=album&q=" + brano_valore,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponse_Spotify).then(onJson_Spotify);
}

function onTokenJson(json)
{
  console.log(json)
  
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}


const client_id = 'd6e714fea40b4a6da1f437e49c8afe80';
const client_secret = '413efddbe3194b73addf82cfcd0bc80f';

let token;

fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);

const form = document.querySelector('#spotify');
form.addEventListener('submit', Cerca_brano);

function onJson_volo(json){
    console.log('json ricevuto');
    console.log(json);

    const sezione=document.querySelector('#visualizza_voli');
    sezione.innerHTML='';


    const input_volo=document.querySelector('#valore_volo');
    const volo_valore=encodeURIComponent(input_volo.value);

    if(volo_valore<101.21){
        const errore=document.createElement('p');
        errore.textContent='Non ci sono voli inferiori a questo costo';
        sezione.appendChild(errore);
    }

    else{
        const lunghezza=json.data.length;
        console.log(lunghezza);

    
    
        for(let i=0;i<lunghezza;i++){
            const volo_corrente=json.data[i];

            const data_partenza=document.createElement('p');
         data_partenza.textContent='Data partenza: '+volo_corrente.departureDate;

            const aereoporto_partenza=document.createElement('p');
            aereoporto_partenza.textContent='Aeroporto di Partenza: '+volo_corrente.origin;

            const image=document.createElement('img');
            image.src="https://staticgeopop.akamaized.net/wp-content/uploads/sites/32/2024/02/aereo-supersonico-linea.jpg";

            const aereoporto_destinazione=document.createElement('p');
            aereoporto_destinazione.textContent='Aeroporto di Arrivo: '+volo_corrente.destination;

            const data_ritorno=document.createElement('p');
            data_ritorno.textContent='Data ritorno: '+volo_corrente.returnDate;

            const prezzo=document.createElement('p');
            prezzo.textContent='Prezzo: '+volo_corrente.price.total;

            const container=document.createElement('div');
            container.appendChild(data_partenza);
            container.appendChild(aereoporto_partenza);
             container.appendChild(image);
            container.appendChild(aereoporto_destinazione);
            container.appendChild(data_ritorno);
            container.appendChild(prezzo);

            container.classList.add('div_da_visualizzare_oauth2');
            sezione.appendChild(container);
        }
        

    }
        
    
}


function onResponse_volo(response){
    return response.json();
}




function Cerca_volo(event){
    event.preventDefault();
    const input_volo=document.querySelector('#valore_volo');
    const volo_valore=encodeURIComponent(input_volo.value);
    console.log('sto eseguendo ricerche sul volo '+volo_valore)

    fetch('https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=PAR&maxPrice='+volo_valore,
    {
        method: "GET",
        headers: {
            "Authorization": "Bearer "+token_2
        }
    }).then(onResponse_volo).then(onJson_volo);
}

function onTokenJson_volo(json)
{
  console.log(json)
  
  token_2 = json.access_token;
}

function onTokenResponse_volo(response)
{
  return response.json();
}


const client_id_volo = 'gdm40Ol9CLcBDDbhRjRNVtvA6A2wlJBn';
const client_secret_volo = 'wpKOfAVAblcyCHMZ';

let token_2;

const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
const params = new URLSearchParams();
params.append("grant_type", "client_credentials");
params.append("client_id", client_id_volo);
params.append("client_secret", client_secret_volo);

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
}).then(onTokenResponse_volo).then(onTokenJson_volo);

const innesco_volo = document.querySelector('#volo');
innesco_volo.addEventListener('submit', Cerca_volo);

function cancella_sezione_voli(event){
    event.preventDefault();
    const sezione_da_eliminare=document.querySelector('#visualizza_voli');
    sezione_da_eliminare.innerHTML='';

}

const cancella_voli=document.querySelector('#pulisci_voli');
cancella_voli.addEventListener('click', cancella_sezione_voli);



function OnJson_torta(json){
    console.log('json ricevuto');
    console.log(json);
   

    const libreria=document.querySelector('#visualizza_torte');
    libreria.innerHTML='';

    const sezione=document.createElement('div');
    


    const data_input=document.querySelector('#valore_id');
    const data_value=encodeURIComponent(data_input.value);

    if(data_value>59){
        const errore=document.createElement('p');
        errore.textContent="numero troppo alto. Inserire un numero minore o uguale a 59";
        libreria.appendChild(errore);
    }
    else{
        const titolo=document.createElement('h2');
        titolo.textContent=json.title;

        const image=document.createElement('img');
        image.src=json.image;

        const difficolta=document.createElement('p');
        difficolta.textContent='Difficoltà: '+json.difficulty;

        const porzioni=document.createElement('p');
        porzioni.textContent='Per quante persone? '+json.portion;


        const messaggio=document.createElement('p');
        messaggio.textContent='Ingredienti:';

        const div_ingredienti=document.createElement('div');
        const lunghezza_ingredienti=json.ingredients.length;
        console.log(lunghezza_ingredienti);
        for(let i=0;i<lunghezza_ingredienti;i++){
            const ingrediente_da_inserire=document.createElement('p');
            let num=i+1;
            ingrediente_da_inserire.textContent=num+') '+json.ingredients[i];
            div_ingredienti.appendChild(ingrediente_da_inserire);
        }

        div_ingredienti.classList.add('ingredienti_torta');
    
        sezione.classList.add('item_div_senza_oauth2');

        sezione.appendChild(titolo);
        sezione.appendChild(image);
        sezione.appendChild(difficolta);
        sezione.appendChild(porzioni);
        sezione.appendChild(messaggio);
        sezione.appendChild(div_ingredienti);

        

        

        

        libreria.appendChild(sezione);
    }
}

function onResponse_torta(response){
    
    return response.json();
    
}


function torte(event){
    event.preventDefault();
    const data_input=document.querySelector('#valore_id');
    const data_value=encodeURIComponent(data_input.value);
    
    console.log('sto eseguendo ricarche sulla data '+ data_value);

    const url = 'https://the-birthday-cake-db.p.rapidapi.com/'+data_value;
    const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'd96b0114f9msh56cf9b2f76f4007p1e497bjsnaffb10d49078',
		'X-RapidAPI-Host': 'the-birthday-cake-db.p.rapidapi.com'
	}
    };
   

   
    fetch(url, options).then(onResponse_torta).then(OnJson_torta);


}



const innesco_torta=document.querySelector('#torta');
innesco_torta.addEventListener('submit', torte);


function mostra_form(){
    const container=document.querySelector('#api');
    
    if(trovato===0){
        container.classList.remove('hidden');
       
        trovato=1;
    }
    else{
        container.classList.add('hidden');
        trovato=0;
    }
}

let trovato=0;

const a_mostra_form=document.querySelector('#mostra_api');
a_mostra_form.addEventListener('click', mostra_form);

function cancella_sezione_notizie(event){
    event.preventDefault();
    const sezione_da_eliminare=document.querySelector('#visualizza_notizie');
    sezione_da_eliminare.innerHTML='';

}

const cancella_notizie=document.querySelector('#pulisci_notizie');
cancella_notizie.addEventListener('click', cancella_sezione_notizie);

function cancella_sezione_torte(event){
    event.preventDefault();
    const sezione_da_eliminare=document.querySelector('#visualizza_torte');
    sezione_da_eliminare.innerHTML='';

}

const cancella_torte=document.querySelector('#pulisci_torte');
cancella_torte.addEventListener('click', cancella_sezione_torte);


function TestoIniziale(){    
    //Questa funzione crea dinamicamente degli elementi h2,p e img, ovvero dei figli che vengono poi aggiunti al padre, cioè un div creato all'inizio della sezione.

    const new_h2=document.createElement('h2');
    new_h2.textContent='Javascript';
    const new_p=document.createElement('p');
    new_p.textContent='in questo sito vi sono alcune funzionalità ottenute tramite javascript'
    const new_img=document.createElement('img');
    new_img.src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png";
    new_img.classList.add('img_javascript');

    const container=document.querySelector('.div_section'); /*selezionerà il primo div con classe .div_section*/
    


    if(flag===0){
        container.appendChild(new_h2);
        container.appendChild(new_p);
        container.appendChild(new_img);
        flag=1;
    }
    else{
        container.innerHTML='';
        flag=0;
    }
}
let flag=0; //ho utilizzato una variabile flag (settata ad 1 quando i figli vengono aggiunti al padre) per eliminare il contenuto del div quando è gia presente.

//Sia l'aggiunta degli elementi, sia lo svuotamento del div, vengono attivati dallo stesso pulsante con id="mostra_introduzione".
const mostra_testo=document.querySelector('#mostra_introduzione');   
mostra_testo.addEventListener('click', TestoIniziale);



function mostraFooter(event){
    
    /*Questa funzione permette di mostrare il footer del sito, inizialmente nascosto, in quanto gli è stato attribuita la classe hidden con display:none;
    La funzione, infatti, consiste nella rimozione della classe hidden dal footer , agendo sulla proprietà classList, mentre, invece, tale classe verrà aggiunta
    al pulsante iniziale usato per attivare l'evento. */


    const object=document.querySelector('footer');
    object.classList.remove('hidden');
    const botton=document.querySelector('#mostra_footer');
    botton.classList.add('hidden');
}
const innesco=document.querySelector('#mostra_footer');
innesco.addEventListener('click', mostraFooter);


function cambiaImmagine(event){

    /*Questa funzione consente di modificare dinamicamente l’URL di un’immagine tramite l’attributo src, quando si passa con il cursore sopra l'immagine
    Quest'immagine, in particolar modo, è l'immagine con id="img_ballerina".*/

    const image=event.currentTarget;
    image.src="https://www.gedistatic.it/content/gnn/img/lastampa/2021/12/23/192101954-3bb22ae6-e1fb-43cd-95c9-b9166b1953d8.jpg";

}

function ritornaImmagine(event){

    //questa funzione consente di ritornare all'url originale quando il cursore non è più sull'immagine 

    const image=event.currentTarget;
    image.src="mhw3/img007.png";
}

const image=document.querySelector('#img_ballerina');
image.addEventListener('mouseover', cambiaImmagine);

const image_original=document.querySelector('#img_ballerina');
image_original.addEventListener('mouseout', ritornaImmagine);

function Colazione(){

    //Si desidera modificare dinamicamente gli oggetti img e p del div con id="div_ingresso".

    const container_img=document.querySelector('#div_ingresso img');
    container_img.src="https://www.mulinobianco.it/origin0/v3/upl/entities/consumptionMomentTimeSlot/momentodiconsumo_01_colazione.png";
    const container_p=document.querySelector('#div_ingresso p');
    container_p.textContent='Ecco alcune idee per la tua colazione';

    /* con questi due cicli for si fa si che, se in precedenza sono stati mostrati altri div con le varie funzioni Pranzo(), Merenda() e Cena(), essi possano
    essere nascosti*/

    const divs = document.querySelectorAll('#div_2 [data-prodotto]');
    for (let i = 0; i < divs.length; i++) {
        divs[i].classList.add('hidden');
    }

    const divs_s = document.querySelectorAll('#div_2 [data-social]');
    for (let i = 0; i < divs_s.length; i++) {
        divs_s[i].classList.add('hidden');
    }

    //si desidera rimuovere la classe hidden ai div relativi alla colazione, i quali hanno tutti data-prodotto=1. Lo stesso discorso vale per i div con data-social=1

    const prodotto=document.querySelector('#div_2 [data-prodotto="1"]');
    prodotto.classList.remove('hidden');
    prodotto.classList.add('container-biscotti');
    const social=document.querySelector('#div_2 [data-social="1"]');
    social.classList.remove('hidden');
    social.classList.add('container-biscotti');
    
}

/*l'evento viene attivato quando si clicca sul pulsante con data-index=1. Sono presenti, in particolare, quattro data-index per i 4 pulsanti rappresentanti
4 orari diversi*/

const innesco_colazione=document.querySelector('#pulsanti_orari [data-index="1"]');  
innesco_colazione.addEventListener('click', Colazione);

function Pranzo(){
    const container_img=document.querySelector('#div_ingresso img');
    container_img.src="https://static.mulinobianco.it/v3/upl/entities/consumptionMomentTimeSlot/momentodiconsumo_03_pranzo.png";
    const container_p=document.querySelector('#div_ingresso p');
    container_p.textContent='Ecco alcune idee per il tuo pranzo';
    
    const divs = document.querySelectorAll('#div_2 [data-prodotto]');
    for (let i = 0; i < divs.length; i++) {
        divs[i].classList.add('hidden');
    }

    const divs_s = document.querySelectorAll('#div_2 [data-social]');
    for (let i = 0; i < divs_s.length; i++) {
        divs_s[i].classList.add('hidden');
    }

    const prodotto=document.querySelector('#div_2 [data-prodotto="2"]');
    prodotto.classList.remove('hidden');
    prodotto.classList.add('container-biscotti');
    const social=document.querySelector('#div_2 [data-social="2"]');
    social.classList.remove('hidden');
    social.classList.add('container-biscotti');
}
const innesco_pranzo=document.querySelector('#pulsanti_orari [data-index="2"]');
innesco_pranzo.addEventListener('click', Pranzo);


function Merenda(){
    const container_img=document.querySelector('#div_ingresso img');
    container_img.src="https://static.mulinobianco.it/v3/upl/entities/consumptionMomentTimeSlot/momentodiconsumo_04_merenda.png";
    const container_p=document.querySelector('#div_ingresso p');
    container_p.textContent='Ecco alcune idee per la tua merenda';
    
    const divs = document.querySelectorAll('#div_2 [data-prodotto]');
    for (let i = 0; i < divs.length; i++) {
        divs[i].classList.add('hidden');
    }

    const divs_s = document.querySelectorAll('#div_2 [data-social]');
    for (let i = 0; i < divs_s.length; i++) {
        divs_s[i].classList.add('hidden');
    }

    const prodotto=document.querySelector('#div_2 [data-prodotto="3"]');
    prodotto.classList.remove('hidden');
    prodotto.classList.add('container-biscotti');
    const social=document.querySelector('#div_2 [data-social="3"]');
    social.classList.remove('hidden');
    social.classList.add('container-biscotti');



}
const innesco_merenda=document.querySelector('#pulsanti_orari [data-index="3"]');
innesco_merenda.addEventListener('click', Merenda);

function Cena(){
    const container_img=document.querySelector('#div_ingresso img');
    container_img.src="https://static.mulinobianco.it/v3/upl/entities/consumptionMomentTimeSlot/momentodiconsumo_06_cena%20-%20Copy%20(1).png";
    const container_p=document.querySelector('#div_ingresso p');
    container_p.textContent='Ecco alcune idee per la tua cena';
    
    const divs = document.querySelectorAll('#div_2 [data-prodotto]');
    for (let i = 0; i < divs.length; i++) {
        divs[i].classList.add('hidden');
    }

    const divs_s = document.querySelectorAll('#div_2 [data-social]');
    for (let i = 0; i < divs_s.length; i++) {
        divs_s[i].classList.add('hidden');
    }

    const prodotto=document.querySelector('#div_2 [data-prodotto="4"]');
    prodotto.classList.remove('hidden');
    prodotto.classList.add('container-biscotti');
    const social=document.querySelector('#div_2 [data-social="4"]');
    social.classList.remove('hidden');
    social.classList.add('container-biscotti');


}
const innesco_cena=document.querySelector('#pulsanti_orari [data-index="4"]');
innesco_cena.addEventListener('click', Cena);



