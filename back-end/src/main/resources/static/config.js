const togglePerfil = () => {
  let perfil = document.querySelector('.perfil');
  let ajuda = document.querySelector('.ajuda');

  let liPerfil = document.querySelector('.li-perfil');
  let liAjuda = document.querySelector('.li-ajuda');

  ajuda.classList.remove('block');
  ajuda.classList.add('hidden');
  liAjuda.classList.remove('text-purple-contrast')
  liAjuda.classList.remove('font-bold')
  liAjuda.classList.remove('border-b-2')
  liAjuda.classList.remove('border-violet-contrast')
  perfil.classList.remove('hidden');
  perfil.classList.add('block');
  liPerfil.classList.add('text-purple-contrast');
  liPerfil.classList.add('font-bold');
  liPerfil.classList.add('border-b-2');
  liPerfil.classList.add('border-violet-contrast');
}

const toggleAjuda = () => {
  let perfil = document.querySelector('.perfil');
  let ajuda = document.querySelector('.ajuda');
  let liPerfil = document.querySelector('.li-perfil');
  let liAjuda = document.querySelector('.li-ajuda');

  ajuda.classList.remove('hidden');
  perfil.classList.remove('block');
  perfil.classList.add('hidden');

  liPerfil.classList.remove('text-purple-contrast');
  liPerfil.classList.remove('font-bold');
  liPerfil.classList.remove('border-b-2');
  liPerfil.classList.remove('border-violet-contrast');

  liAjuda.classList.add('text-purple-contrast');
  liAjuda.classList.add('font-bold');
  liAjuda.classList.add('border-b-2');
  liAjuda.classList.add('border-violet-contrast');

}

toggleAcordion = (id) => {
  let acordion = document.getElementById(id);
  acordion.classList.toggle('hidden');
}