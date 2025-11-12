document.getElementById("formGato").addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const raca = document.getElementById("raca").value;

  const lista = document.getElementById("listaGatos");
  const item = document.createElement("li");
  item.textContent = `🐱 Nome: ${nome} | Idade: ${idade} | Raça: ${raca}`;
  lista.appendChild(item);

  document.getElementById("formGato").reset();
});