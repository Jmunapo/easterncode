import { Injectable } from '@angular/core';

@Injectable()
export class NewUserProvider {

  constructor() {
    console.log('Hello NewUserProvider Provider');
  }

  teach(){
    let welcomeData = {
      level0: `They said, if you can't explain it then you don't understand it,
    please take your time to summarize what you have learnt. Your article should answer two questions only, How to ___ ? 
    and What is ___?, Try by all means to be short, clear to the point.`,
      level1: `Click <i class="fa fa-caret-down fa-2x" aria-hidden="true"></i> to open your tools <br />
     Click <i class="fa fa-pencil-square fa-2x" aria-hidden="true"></i> to start editing. <br />
     Click <i class="fa fa-question-circle fa-2x" aria-hidden="true"></i> to open these instruction <br />
     Click <i class="fa fa-eye fa-2x" aria-hidden="true"></i> to preview your document <br />
     Click <i class="fa fa-paper-plane fa-2x" aria-hidden="true"></i> to submit.`,
      level2: ` <h4>Last but not least</h4> <br /> 
    Click <i class="fa fa-text-width fa-2x" aria-hidden="true"></i> to access editing tools. <br />
    Links and emails will be converted on submit. <br />
    Learn to <i class="fa fa-share-alt" aria-hidden="true"></i>. <br />
    <p style="text-aling:center; color: #ff6600"> <i class="fa fa-smile-o" aria-hidden="true"></i> Happy coding </p> `
    };
    return welcomeData;
  }

  urlify(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
  }

}
