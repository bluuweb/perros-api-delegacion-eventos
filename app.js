const formulario = document.getElementById('formulario')
const fotoPreview = document.getElementById('fotoPreview')
const raza = document.getElementById('raza')
const cards = document.getElementById('cards')
const templateCards = document.getElementById('templateCards').content
const btnAgregar = document.getElementById('btnAgregar')

let imagen;
let arrayPerros = []

document.addEventListener('DOMContentLoaded', async (e) => {

    if (localStorage.getItem('arrayPerros')) {
        arrayPerros = JSON.parse(localStorage.getItem('arrayPerros'))
        pintarPerros()
    }

    try {
        const res = await fetch('perros.json')
        const data = await res.json()
        console.log(Object.keys(data.message))
        const fragment = document.createDocumentFragment()
        Object.keys(data.message).forEach(item => {
            const option = document.createElement('option')
            option.value = item
            option.textContent = item
            fragment.appendChild(option)
        })
        raza.appendChild(fragment)
    } catch (error) {
        console.log(error)
    }
})

raza.addEventListener('change', async (e) => {
    console.log(e.target.value)
    fotoPreview.textContent = ""

    try {
        const res = await fetch(`https://dog.ceo/api/breed/${e.target.value}/images/random`)
        const perro = await res.json()

        imagen = perro.message

        const img = document.createElement('img')
        img.src = perro.message
        img.className = "mb-1"
        img.style.maxWidth = "300px"
        fotoPreview.appendChild(img)

        if (imagen) {
            btnAgregar.disabled = false
        }

    } catch (error) {
        console.log(error)
    }
})

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = new FormData(formulario)
    const objetoData = Object.fromEntries([...data.entries()])
    objetoData.id = `id-${Date.now()}`
    objetoData.img = imagen

    arrayPerros.push(objetoData)

    pintarPerros()

    // Reset element
    formulario.reset()
    imagen = null
    fotoPreview.textContent = ''
    btnAgregar.disabled = true
})

cards.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        arrayPerros = arrayPerros.filter(item => item.id !== e.target.dataset.id)
        pintarPerros()
    }
})

const pintarPerros = () => {
    cards.textContent = ""
    const fragment = document.createDocumentFragment()
    arrayPerros.forEach(objetoData => {
        const clone = templateCards.cloneNode(true)
        clone.querySelector('img').src = objetoData.img
        clone.querySelector('h5').textContent = objetoData.nombre
        clone.querySelector('p').textContent = `Raza: ${objetoData.raza}`
        clone.querySelector('button').dataset.id = objetoData.id
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)

    localStorage.setItem('arrayPerros', JSON.stringify(arrayPerros))
}