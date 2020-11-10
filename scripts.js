const DEVELOP_BASE_URL = 'http://localhost:3000/api/'
//Shanna@melissa.tv

$('.login_form').submit(async(event)=>{
  event.preventDefault()
  const email = $('#email').val()
  const password = $('#password').val()
  const token = await getToken(email,password)
  const total = await getResource('total', token)

  $("#loginform").modal("toggle");
  crearGraficoPrincipal(total)
  llenarTabla(total, "js-table-posts")
})

async function getToken(email, password){
  try{
    const response =  await fetch(`${DEVELOP_BASE_URL}login`,{ // Se usa la constante (DEVELOP_BASE_URL) declarada en la linea 1
      method: 'POST',
      body: JSON.stringify( { email: email, password: password } )
    })
    const { token } = await response.json()
    localStorage.setItem('jwt-token',token)
    return token;
  } catch(err){
    console.log(err);
  }
}

async function getResource(resource, token){
  try{
    const response = await fetch(`${DEVELOP_BASE_URL}${resource}`,{ // Se usa la constante (DEVELOP_BASE_URL) declarada en la linea 1
      method:'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { data } = await response.json()

    return (data)
  } catch(err) {
    console.log(err);
  }
}

function llenarTabla(total, tabla){
  let tableContent = ''
  
  total.forEach(function (dato, indice) {

    tableContent += `<tr>
      <td>${dato.location}</td>
      <td>${dato.active}</td>
      <td>${dato.confirmed} </td>
      <td>${dato.deaths} </td>
      <td>${dato.recovered} </td>
      <td>
        <button meta-id="${indice}" meta-country="${dato.location}" class="modelo">Ver detalles</button>
      </td>
    </tr>`;
  });
  $(`#${tabla} tbody`).append(tableContent);
}

function crearGraficoPrincipal(data) {
  data = data.filter(function (elemento) {return elemento.active >= 10000})
  data.sort(((a, b) => b.active - a.active))

  var dataActivos = data.map(function (info){
          return{ label: info.location, y: info.active}
  })
  var dataConfirmados = data.map(function (info){
      return{ label: info.location, y: info.confirmed}
  })
  var dataMuertos = data.map(function (info){
      return{ label: info.location, y: info.deaths}
  })
  var dataRecuperados = data.map(function (info){
      return{ label: info.location, y: info.recovered}
  })
  var chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: false,
      animationEnabled: true,
      title:{
          text: "Casos a nivel mundial"
      },
      subtitles: [{
          text: ""
      }], 
      axisX: {
          title: "",
          labelAngle: 90,
      },
      axisY: {
          includeZero: true
      },
      toolTip: {
          shared: true
      },
      legend: {
          cursor: "pointer",
      },
      data: [{
          type: "column",
          name: "Casos Activos",
          showInLegend: true,      
          yValueFormatString: "#,##0.# Casos",
          dataPoints:dataActivos
      },
      {
          type: "column",
          name: "Casos Confirmados",
          showInLegend: true,
          yValueFormatString: "#,##0.# Casos",
          dataPoints: dataConfirmados
  },
      {
          type: "column",
          name: "Muertes",
          showInLegend: true,
          yValueFormatString: "#,##0.# Personas",
          dataPoints: dataMuertos
      },
      {
          type: "column",
          name: "Recuperados",
          showInLegend: true,
          yValueFormatString: "#,##0.# Personas",
          dataPoints: dataRecuperados
      }]
  });

  $("#containerTabla").attr("style", "margin-top:25%;"); 

  chart.render();

}