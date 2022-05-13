interface IVeiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);

    function calcTime(millis: number) {

        const min = Math.floor(millis / 60000)
        const sec = Math.floor(millis % 60000) / 1000

        return `${min}m e ${sec}s`;
    }

  function patio() {
    function ler(): IVeiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: IVeiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: IVeiculo, save?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class='delete' data-placa='${veiculo.placa}'>X</button>
                </td>
            `;

      row.querySelector('.delete')?.addEventListener("click", function() {
        remover(this.dataset.placa)
      })

      $("#patio")?.appendChild(row);

      if (save) {
        salvar([...ler(), veiculo]);
      }
    }

    function remover(placa : string) {
        const { nome, entrada } = ler().find(veiculo => veiculo.placa === placa);

        const time  = calcTime(new Date().getTime() - new Date(entrada).getTime()) 

        if(!confirm(`O veiculo ${nome} permaneceu por ${time}. Deseja encerrar?`)) return

        salvar(ler().filter(veiculo => veiculo.placa !== placa))
        render()
    }

    function render() {
      $("#patio")!.innerHTML = "";

      const patio = ler();

      if (patio.length) {
        patio.forEach((veiculo) => adicionar(veiculo));
      }
    }

    return { ler, adicionar, salvar, render, remover };
  }

  patio().render();
  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    if (!nome || !placa) {
      alert("Os campos nome e placa são obrigatórios");
      return;
    }

    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
  });
})();
