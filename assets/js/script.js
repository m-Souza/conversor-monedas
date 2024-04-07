
const currencySection = document.querySelector("#cSection");
const campoInputConvertir = document.querySelector("#inputConvertir");
const campoResultado = document.querySelector("#resultado");
const botonBuscar = document.querySelector("#buscar")
const currencyToConvert = document.querySelector("#currency-selector")
const campoResultadoCompleto = document.querySelector("#campoResultadoCompleto")

async function getCurrencyData(){
    try{
        const currencyRes = await fetch("https://mindicador.cl/api/");
        const currencyData = await currencyRes.json();
        return currencyData;
    } catch (e){
        // console.log(e)
        campoResultado.innerHTML = e.message
    }
}

async function getAndCreateDataToChart() {
    var currency = currencyToConvert.value;
    const currencyRes = await fetch(`https://mindicador.cl/api/${currency}`);
    const currencyData = await currencyRes.json();
    const quoteSerie = currencyData["serie"];    
    const quoteLastTen = quoteSerie.slice(0,10);
    // console.log(quoteLastTen)
    const labels = quoteLastTen.map((q) => {
        return q.fecha;
    });
    const data = quoteLastTen.map((q) => {
        const value = q.valor;
        return Number(value);
    });
    // console.log(quoteValue)
    const datasets = [
    {
        label: "Moneda",
        borderColor: "rgb(255, 99, 132)",
        data
    }
    ];
    // console.log(labels);
    console.log({labels, datasets})
    return { labels, datasets };
}

async function renderGrafica() {
    const data = await getAndCreateDataToChart();
    const config = {
        type: "line",
        data
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
    }


botonBuscar.addEventListener(`click`, async () => {
    campoResultado.innerHTML = `Loading...`;
    
    try {
        var currency = currencyToConvert.value;
        const quoteAll = await getCurrencyData();
        const quote = quoteAll[currency]["valor"];
        var totalConverted = quote*campoInputConvertir.value;
        campoResultado.innerHTML = totalConverted;
        
        renderGrafica();

    } catch (e){
        // console.log(e)
        campoResultadoCompleto.innerHTML = e.message
      return;
    }
  
  })