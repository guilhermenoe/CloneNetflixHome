import React, { useEffect, useState } from "react";
import "./App.css";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";

export default () => {
  //Utilizando e guardando os dados da lista de filmes
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  //informar quando o header deve ficar de fato black
  const [blackHeader, setBlackHeader] = useState(false);

  // useEffect utilizado para ser executado assim que a tela for redenrizada
  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista total de filmes
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //pegando o featured
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListiner = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListiner);

    return () => {
      window.removeEventListener("scroll", scrollListiner);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito por Guilherme Noé{" "}<span role="img" aria-label="coração"> 👨‍🎓</span>{" "}através das aulas B7Web <br />
        Diretiros de Imagem para Netflix <br />
        Dados pegos Pela API do site Themoviedb.org
      </footer>

      {movieList.length <=0 &&     
      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="carregando" />
      </div>
      }
    </div>
  );
};
