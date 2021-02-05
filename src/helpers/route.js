const fs = require('fs');

class Route {

    // Código da função de renderização das rotas
    setRoute(file, app, res, data = null) {
        let diretorio = app.get('views') + `/${file}.html`;
        fs.readFile(diretorio, 'utf8', (err, text) => {
            function replace_component(html) {
                let possivel_componente = html.match(/\@\((.*?)\)/);

                if (possivel_componente != null) {
                    // Verificação de componentes
                    let nome_componente = possivel_componente[1];
                    let diretorio_component = app.get('components') + `/${nome_componente}.html`;
                    fs.readFile(diretorio_component, 'utf8', (err, component) => {
                        let componente = component;
                        html = html.replace(`@(${nome_componente})`, componente);
                        replace_component(html);
                    })

                } else if (data != null) {
                    // Verificação de variaveis de ambiente
                    let possivel_variavel = html.match(/\$\((.*?)\)/);
                    if (possivel_variavel != null) {
                        let key = possivel_variavel[1];

                        if (data.length > 0) {
                            data.map(dat => {
                                if (dat.key == key) {
                                    html = html.replace(`$(${key})`, dat.value);
                                    replace_component(html);
                                }
                            })
                        }
                    } else {
                        res.send(html);
                    }
                } else {
                    res.send(html);
                }
            }
            replace_component(text);
        });
    }
}

module.exports = Route;