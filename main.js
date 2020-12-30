let route = 'login'
let agenciasState = []
let autosState = []
let reservasState = []

const renderreserva = (response, autosState) => {
    const auto = autosState.find(auto => auto._id === response.auto_id)
    const htmlObject = stringToHTML(`<li auto-id="${response._id}">${auto.desc} - ${response.user_id}</li>`)
    return htmlObject
}


const renderAgencia = (agencia) => {
  const renderedAgencia = stringToHTML(`<li class="agencia-list-items clickable" id="${agencia._id}"></li>`)
  const agenciaDatos =  stringToHTML(`<p>Agencia: ${agencia.nombre} <br /> Contacto: ${agencia.contacto} <br /> Correo: ${agencia.correo} <br /> Direccion: ${agencia.direccion} </p>`)
  renderedAgencia.appendChild(agenciaDatos)

  renderedAgencia.addEventListener('click', () => {
    const agenciasList = document.getElementById('agencias-list')
    const inputAgenciaId = document.getElementById('agencia-id')
    Array.from(agenciasList.children).forEach(agencia => agencia.classList.remove('selected'))
    renderedAgencia.classList.add('selected')
    inputAgenciaId.value = agencia._id
    // alert(inputAgenciaId.value)
    renderAgenciaAutos(agencia._id)
  })
  return renderedAgencia
}

const renderAgenciaAutos = (agenciaId) => {
    // console.log(autosState)

    const autosList = document.getElementById('autos-list')
    const agenciaAutosArray = autosState.reduce( (autosArray, auto) => {
      if (auto.agencia_id === agenciaId){
        autosArray.push(auto)
      }
      return autosArray 
    }, []) 

    // console.log(agenciaAutosArray)
    autosList.innerHTML = ''
    const autosRederedArray = agenciaAutosArray.map(auto => renderAuto(auto))
    console.log(autosRederedArray)
    autosRederedArray.forEach(auto => auto.appendChild(renderButton(auto)))
    autosRederedArray.forEach(auto => autosList.appendChild(auto))
}

const renderAuto = (auto) => {
  const renderedAuto = stringToHTML(`<li class="auto-list-items clickable"  id="${auto._id}"></li>`)
  const renderedImg = stringToHTML(`<img src="${auto.link}">`)
  const autoDatos = stringToHTML(`<p>Marca: ${auto.marca} <br /> Modelo: ${auto.modelo} <br /> Precio por dia: $${auto.precio_diario} <br /> Deposito por dia: $${auto.deposito} </p>`)
  renderedAuto.appendChild(renderedImg)
  renderedAuto.appendChild(autoDatos)

  renderedAuto.addEventListener('click', (e) => {
    // e.preventDefault()
    const autosList = document.getElementById('autos-list')
    Array.from(autosList.children).forEach(auto => auto.classList.remove('selected'))
    renderedAuto.classList.add('selected')
    const inputAutoId = document.getElementById('auto-id')
    inputAutoId.value = auto._id
    // alert(inputAutoId.value)
  })
  return renderedAuto
}
// Modelo: ${auto.modelo} <br />
const renderReserva = (reserva) => {
  const renderedReserva = stringToHTML(`<li class="reserva-list-items" id="${reserva._id}"></li>`)
  const agencia = agenciasState.find(agencia => reserva.agencia_id === agencia._id)
  const auto = autosState.find(auto => reserva.auto_id === auto._id)
  const reservaDatos = stringToHTML(`<p>Agencia: ${agencia.nombre} <br / >  Monto: ${reserva.monto}</p>`)
  renderedReserva.appendChild(reservaDatos)

  renderedReserva.addEventListener('click', () => {
     // alert('Hello!') 
    /*const autosList = document.getElementById('autos-list')
    Array.from(autosList.children).forEach(auto => auto.classList.remove('selected'))  
    renderedAuto.classList.add('selected')*/
    
  })
  return renderedReserva
}

const getStartDate = () => {
  const day = document.getElementById('start-day').value
  const month = document.getElementById('start-month').value
  const year = document.getElementById('start-year').value
  const hour = document.getElementById('start-hour').value
  const time = document.getElementById('start-time').value
  const startDate = day.concat('/',month,'/',year,'  ',hour,':00:00',' ',time)
  return startDate
}

const getEndDate = () => {
  const day = document.getElementById('end-day').value
  const month = document.getElementById('end-month').value
  const year = document.getElementById('end-year').value
  const hour = document.getElementById('end-hour').value
  const time = document.getElementById('end-time').value
  const endDate = day.concat('/',month,'/',year,'  ',hour,':00:00',' ',time)
  return endDate
}

const actualizaAutos = (auto_id) => {
  const disponibilidad = {
    disponibilidad : false,
  }
  fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/autos/'.concat(auto_id), {
      method: 'PUT',
      headers:{
         'Content-Type': 'application/json',
         'token': localStorage.getItem('token'),
         'key': localStorage.getItem('key'),
      },
      body: JSON.stringify(disponibilidad)
  })
  // .then(response => response.json())
  .then(response => {
    // inicializo la lista de autos
      fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/autos',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem('token'),
              'key': localStorage.getItem('key'), 
            },
      })
      .then(response => response.json())
      .then(response => {
        autosState = response 
        const autosList = document.getElementById('autos-list') 
        const autosArray = response.map(auto => renderAuto(auto))
        // autosList.removeChild(autosList.firstElementChild)
        autosArray.forEach(auto => auto.appendChild(renderButton(auto)))
        autosList.innerHTML = ''
        autosArray.forEach(auto => autosList.appendChild(auto))
        // autosList.forEach(auto => auto.appendChild(bttn))
     })
  })
}

const renderButton = (auto) => {
  const renderedButton = stringToHTML(`<button class="bttn clickable">Reservar</button>`)
  renderedButton.addEventListener('click', (e) => {

    //Agencia id
    const inputAgenciaId = document.getElementById('agencia-id')
    const agencia_id = inputAgenciaId.value

    //Auto id
    const inputAutoId = document.getElementById('auto-id')
    const auto_id = renderedButton.parentNode.id
    //fecha inicio y final
    const fecha_inicio= getStartDate()
    const fecha_fin=  getEndDate()

    //monto
    const monto = 25.36
    const estado = 'open'

    // alert(agencia_id)
    // alert(auto_id)

    const reserva = {
      agencia_id,
      auto_id,
      fecha_inicio,
      fecha_fin,
      monto,
      estado,
    }

    fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/reservas', {
      method: 'POST',
      headers:{
         'Content-Type': 'application/json',
         'token': localStorage.getItem('token'),
         'key': localStorage.getItem('key'),
      },
      body: JSON.stringify(reserva)
    })
    .then(response => response.json())
    .then(response => {
      // inicializo la lista de reservas 
      fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/reservas', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem('token'),
              'key': localStorage.getItem('key'), 
            },
          }
        )
        .then(response => response.json())
        .then(response => {
          reservasState = response
          const reservasList = document.getElementById('reservas-list')
          const reservasArray = response.map(reserva => renderReserva(reserva))
          // reservasList.removeChild(reservasList.firstElementChild)
          reservasList.innerHTML = ''
          reservasArray.forEach(reserva => reservasList.appendChild(reserva))
          actualizaAutos(auto_id)
          alert('Su reserva ha sido realizada con exito!')
        })
      })
    .catch(e => alert('No tiene permisos para crear reservas'))
  })
  return renderedButton
}



//Converting string to Html object
const stringToHTML = (s) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(s, 'text/html')
  return doc.body.firstChild
}

//rendering each item from the array pulled from the db and adding an click event listener
const renderItem = (item) => {
 const htmlObject = stringToHTML(`<li auto-id="${item._id}">${item.desc}</li>`)

  //Code to run every time an auto is clicked 
  htmlObject.addEventListener('click', () => {
    const autosList = document.getElementById('autos-list')
    const autosIdInput = document.getElementById('autos-id')
    
    //Convert every auto from the auto liest to an array and do a foreach to remove the selected class from all of them.
    Array.from(autosList.children).forEach( auto  => auto.classList.remove('selected'))

    //Add the selected class to the HTML Object which has been clicked
    htmlObject.classList.add('selected')
    autosIdInput.value = item._id
  })
  return htmlObject
}

const initLists = () => {

  // inicializo la lista de agencias
  fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/agencias',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem('token'),
              'key': localStorage.getItem('key'), 
            },
  })
    .then(response => response.json())
    .then(response => {
      agenciasState = response
      const agenciasList = document.getElementById('agencias-list') 
      const agenciasArray = response.map(agencia => renderAgencia(agencia))
      agenciasList.removeChild(agenciasList.firstElementChild)
      agenciasArray.forEach(agencia => agenciasList.appendChild(agencia))


      // inicializo la lista de autos
      fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/autos',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem('token'),
              'key': localStorage.getItem('key'), 
            },
      })
        .then(response => response.json())
        .then(response => {
          autosState = response
          const autosList = document.getElementById('autos-list') 
          const autosArray = response.map(auto => renderAuto(auto))
          autosList.removeChild(autosList.firstElementChild)
          autosArray.forEach(auto => auto.appendChild(renderButton(auto)))
          autosArray.forEach(auto => autosList.appendChild(auto))
          // autosList.forEach(auto => auto.appendChild(bttn))

          // inicializo la lista de reservas 
            fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/reservas', {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                    'key': localStorage.getItem('key'), 
                  },
                }
              )
            .then(response => response.json())
            .then(response => {
              reservasState = response
              const reservasList = document.getElementById('reservas-list')
              const reservasArray = response.map(reserva => renderReserva(reserva))
              reservasList.removeChild(reservasList.firstElementChild)
              reservasArray.forEach(reserva => reservasList.appendChild(reserva))
            })
            .catch(e => {
              const reservasList = document.getElementById('reservas-list')
              reservasList.removeChild(reservasList.firstElementChild)
            })
        }) 
    })
}

const signOut = () => {
  const signOut = document.getElementById('sign-out')
  signOut.addEventListener('click', () => {
    localStorage.clear()
    renderLogin()
  })
}

const renderMainSection = () => {
  const webSectionTemplate = document.getElementById('main-section')
  document.getElementById('web-cont').innerHTML = webSectionTemplate.innerHTML
  
  // initReservasForm()

  //Inicializa las listas
  initLists()
  signOut()
}


const registerUser = () => {
  const registerForm =  document.getElementById('register-form')
  registerForm.onsubmit = (e) => {
    e.preventDefault()

    const cedula = document.getElementById('register-id').value
    const nombre = document.getElementById('register-nombre').value
    const apellido = document.getElementById('register-apellido').value
    const correo = document.getElementById('register-correo').value
    const direccion = document.getElementById('register-direccion').value
    const contacto = document.getElementById('register-contacto').value
    const clave = document.getElementById('register-clave').value
    
    fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/usuarios/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token'),
        'key': localStorage.getItem('key'), 
      },
      body: JSON.stringify({ cedula, nombre, apellido, correo, direccion, contacto, clave, })
    })
     .then(response => response.json())
     .then(response => {
       // console.log(response)
       renderLogin()
      }
    )
  } 

}


const renderRegister = () =>{
  const registerLink = document.getElementById('register-link')
  registerLink.addEventListener('click', () => {
     // alert('vas a ser redireccionado a register template')
    const registerTemplate = document.getElementById('register-template')
    document.getElementById('web-cont').innerHTML = registerTemplate.innerHTML
    registerUser()
    const loginLink = document.getElementById('login-link')
      loginLink.addEventListener('click', () => {
         // alert('vas a ser redireccionado a login template')
         renderLogin()
        // const loginTemplate = document.getElementById('login-template')
        // document.getElementById('web-cont').innerHTML = loginTemplate.innerHTML
        // loginUser()
    })

  })


}



const renderLogin = () => {
  const loginTemplate = document.getElementById('login-template')
  document.getElementById('web-cont').innerHTML = loginTemplate.innerHTML

  const loginForm =  document.getElementById('login-form')
  renderRegister()
  loginForm.onsubmit = (e) => {
    e.preventDefault()

    const correo = document.getElementById('correo').value
    const clave = document.getElementById('clave').value
    
    fetch('https://restful-api-alquiler-de-automoviles.alvarez-carlos.vercel.app/api/usuarios/loguear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token'),
        'key': localStorage.getItem('key'), 
      },
      body: JSON.stringify({ correo, clave })
    })
     .then(response => response.json())
     // .then(response => console.log(response))
     .then(response => {
       localStorage.setItem('token', response.token)
       localStorage.setItem('key', response.key)
       // route = 'reserva'
       renderMainSection()
      }
    )
     .catch(e => {
      const error = document.getElementById('error')
      error.removeAttribute('hidden')
     })
  } 
}

const renderApp = () => {

  const token = localStorage.getItem('token')
  //  const token = true 
  if (token) {
     return renderMainSection()
  }
  renderLogin()
  renderRegister()
}

window.onload = () => {
  renderApp()
}
