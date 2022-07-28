import { getAll } from 'src/assets/repository/database';
import { Component, OnInit } from '@angular/core';
import { keywordModel } from 'src/entities/keyword';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public categoryKeyword: string = "";
  public keyword: string = "";
  public list: string[] = [];
  public life: number = 6;
  public score: number = 0;
  public isFirst: boolean = true;
  public totalScore: number = 0;
  public points: number = 20;

  public keywords: keywordModel[] = []

  constructor() { }

  ngOnInit(): void {
    this.getKeywords();
    this.generateKeyword();
    this.setWord();
  }

  public getKeywords = () => {
    if (this.isFirst) {
      this.keywords = getAll();
      this.totalScore = this.keywords.length * this.points;
      this.isFirst = false;
    }
  }

  public generateKeyword = () => {
    let wordIndex = Math.ceil(Math.random() * this.keywords.length) - 1;
    this.keyword = this.keywords[wordIndex].name;
    this.categoryKeyword = this.keywords[wordIndex].category;
  }

  public setWord = () => {

    let cat = document.querySelector(".category") as HTMLElement;
    let key = document.querySelector(".keyword") as HTMLElement;
    cat.innerHTML = this.categoryKeyword;
    key.innerHTML = "";

    for (let i = 0; i < this.keyword.length; i++) {

      if (this.list[i] === undefined) {
        this.list[i] = "&nbsp"
      }

      key.innerHTML += `<div class="words">${this.list[i]}</div>`;

    }

  }

  public changeLetterStyle = (query: string) => {
    let element = document.querySelector(query) as HTMLElement;
    element.style.background = "#C71585";
    element.style.color = "white";
    element.setAttribute("disabled", "true");
  }

  public backToInitialStyle = () => {
    let divKey = document.querySelectorAll(`.keys`);
    document.querySelector(".image")?.removeAttribute("style");
    divKey.forEach(div => {
      for (let i = 0; i < div.children.length; i++) {
        div.children[i].removeAttribute("disabled");
        div.children[i].removeAttribute("style");
      }
    });
    this.list = [];
  }

  public compareLists = (letter: string) => {
    const index = this.keyword.indexOf(letter)

    if (index < 0) {
      this.life -= 1;
      this.loadImage();

      if (this.life == 0) {

        setTimeout(() => {
          Swal.fire({
            title: `Não foi dessa vez, a resposta correta é "${this.keyword}".`,
            text: "Deseja reiniciar o jogo?",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar'
          }).then((result) => {

            if (result.isConfirmed) {
              window.location.reload();
            } else {
              Swal.fire(
                'Fim do Jogo!',
                `Seu score é de ${this.score} de ${this.totalScore} pontos.`,
                'success'
              )
            }
          });
        }, 500);
      }
    } else {
      for (let i = 0; i < this.keyword.length; i++) {
        if (this.keyword[i] === letter) {
          this.list[i] = letter;
        }
      }
    }

    let win = true;

    for (let i = 0; i < this.keyword.length; i++) {
      if (this.keyword[i] !== this.list[i]) {
        win = false;
      }
    }

    if (win) {
      this.life = 6;
      this.score += this.points;
      setTimeout(() => {
        this.keywords = this.keywords.filter((keyword) => keyword.name != this.keyword);

        if (this.keywords.length > 0) {
          Swal.fire({
            title: 'Parabéns, você conseguiu!\n+20 pontos!',
            text: "Deseja continuar?",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar'
          }).then((result) => {

            if (result.isConfirmed) {
              this.backToInitialStyle();
              this.ngOnInit();
            } else {
              Swal.fire(
                'Fim do Jogo!',
                `Seu score é de ${this.score} de ${this.totalScore} pontos.`,
                'success'
              )
            }
          });
        } else {
          Swal.fire(
            'Fim do Jogo!',
            `Seu score é de ${this.score} de ${this.totalScore} pontos.`,
            'success'
          )
        }

      }, 500);
    }

  }

  public checkLetter = (letter: string) => {
    if (this.life > 0) {
      this.changeLetterStyle(`.btn-${letter}`);
      this.compareLists(letter);
      this.setWord();
    }
  }

  public loadImage = () => {
    let query = document.querySelector(".image") as HTMLElement;
    switch (this.life) {
      case 5:
        query.style.backgroundImage = `url("./assets/img/forca01.jpg")`;
        break;
      case 4:
        query.style.backgroundImage = `url("./assets/img/forca02.jpg")`;
        break;
      case 3:
        query.style.backgroundImage = `url("./assets/img/forca03.jpg")`;
        break;
      case 2:
        query.style.backgroundImage = `url("./assets/img/forca04.jpg")`;
        break;
      case 1:
        query.style.backgroundImage = `url("./assets/img/forca05.jpg")`;
        break;
      case 0:
        query.style.backgroundImage = `url("./assets/img/forca06.jpg")`;
        break;

      default:
        query.style.background = `url("./assets/img/forca.jpg")`;
        break;
    }
  }

  public reload = () => {
    window.location.reload();
  }

}
