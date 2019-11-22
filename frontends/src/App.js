import React from 'react';
import './style/scss/main.scss';
import './style/scss/style.scss';
import { Board } from './components/board';
import Register from './components/Register';
import Cell from './components/Cell';
import TileView from './components/TileView';
import GameEndOverlay from './components/GameEndOverlay';
<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.css';
import ApiService from './services/ApiService';
<<<<<<< HEAD
const { seedPrivate } = require('eosjs-ecc');
=======
import ApiService from './services/ApiService';
>>>>>>> api service call endgame action
=======
import LeaderBoard from './components/leaderboard';
>>>>>>> connect to blockchain

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Board(),
      form: {
        username: '',
        pass: '',
        key: '',
        error: ''
      },
      isSigningIn: false,
      isLoggedIn: false,
      displayLogin: false,
      loginError: 'none'
    };
    localStorage.setItem('bestscore', 0);
  }

  restartGame() {
    this.setState({ board: new Board() });
  }

  newGame = async () => {
    let ranks = await ApiService.getRank();
    console.log(ranks);
    // try {
    //   await ApiService.register();
    // } catch (e) {
    //   console.log(e);
    // }
    // try {
    //   await ApiService.login();
    // } catch (e) {
    //   console.log(e);
    // }
    // try {
    //   let test = await ApiService.sortRank();
    //   console.log(test);
    // } catch (e) {
    //   console.log(e);
    //   if (e.toString().indexOf('wrong public key') !== -1) {
    //     this.setState({ loginError: `Wrong password`, isSigningIn: false });
    //   } else if (e.toString().indexOf('vaccount not found') !== -1) {
    //     this.setState({ loginError: `Wrong password`, isSigningIn: false });
    //   } else if (e.toString().indexOf('invalid nonce') !== -1) {
    //     this.setState({ loginError: `Please try again`, isSigningIn: false });
    //   } else if (e.toString().indexOf('vaccount already exists') !== -1) {
    //     this.setState({ loginError: `Account must be a-z 1-5`, isSigningIn: false });
    //   } else if (e.toString().indexOf(`required service`) !== -1) {
    //     this.setState({ loginError: `DSP Error, please try again`, isSigningIn: false });
    //   } else {
    //     this.setState({ loginError: e.toString(), isSigningIn: false });
    //   }
    //   return;
    // }
    // this.setState({ board: new Board() });
  };

  saveGame = async () => {
    try {
      // await ApiService.endGame(this.state.board.getScore());
      await ApiService.login();
    } catch (error) {
      console.log(error);
    }
  };

  handleKeyDown(event) {
    if (this.state.board.hasWon()) {
      return;
    }
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      event.preventDefault();
      let direction = event.keyCode - 37;
      this.setState({ board: this.state.board.move(direction) });
    }
  }

  handleTouchStart(event) {
    if (this.state.board.hasWon()) {
      return;
    }
    if (event.touches.length !== 1) {
      return;
    }
    this.startX = event.touches[0].screenX;
    this.startY = event.touches[0].screenY;
    event.preventDefault();
  }

  handleTouchEnd(event) {
    if (this.state.board.hasWon()) {
      return;
    }
    if (event.changedTouches.length !== 1) {
      return;
    }
    let deltaX = event.changedTouches[0].screenX - this.startX;
    let deltaY = event.changedTouches[0].screenY - this.startY;
    let direction = -1;
    if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      direction = deltaX > 0 ? 2 : 0;
    } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
      direction = deltaY > 0 ? 3 : 1;
    }
    if (direction !== -1) {
      this.setState({ board: this.state.board.move(direction) });
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.isComponentMounted = true;
    this.attemptCookieLogin();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.isComponentMounted = false;
  }

  showHideLogin = () => {
    this.setState({ displayLogin: !this.state.displayLogin });
  };

  login = async (event) => {
    if (!this.state.form.username || !this.state.form.pass) {
      this.setState({ loginError: `Please provide a username / password` });
      return;
    }
    event.preventDefault();

    const { form } = this.state;
    console.log('----------------------');
    console.log(form);
    this.setState({ isSigningIn: true });
    try {
      await ApiService.register(form);
    } catch (e) {
      console.log(e);
    }
    try {
      await ApiService.login(form);
    } catch (e) {
      if (e.toString().indexOf('wrong public key') !== -1) {
        this.setState({ loginError: `Wrong password`, isSigningIn: false });
      } else if (e.toString().indexOf('vaccount not found') !== -1) {
        this.setState({ loginError: `Wrong password`, isSigningIn: false });
      } else if (e.toString().indexOf('invalid nonce') !== -1) {
        this.setState({ loginError: `Please try again`, isSigningIn: false });
      } else if (e.toString().indexOf('vaccount already exists') !== -1) {
        this.setState({ loginError: `Account must be a-z 1-5`, isSigningIn: false });
      } else if (e.toString().indexOf(`required service`) !== -1) {
        this.setState({ loginError: `DSP Error, please try again`, isSigningIn: false });
      } else {
        this.setState({ loginError: e.toString(), isSigningIn: false });
      }
      return;
    }

    this.setState({
      isSigningIn: false,
      isLoggedIn: true,
      displayLogin: false
    });
  };

  logout = () => {
    localStorage.removeItem('user_account');
    localStorage.removeItem('user_key');
    window.location.reload();
  };

  attemptCookieLogin = async () => {
    this.setState({ isAddingAccount: true });
    let account = localStorage.getItem('user_account');
    let key = localStorage.getItem('user_key');
    if (account != null && key != null) {
      this.setState({ isLoggedIn: true, form: { username: account } });
    }
    this.setState({ isAddingAccount: false });
    return;
  };

  handleChangeLogin(event) {
    const { name, value } = event.target;
    const { form } = this.state;
    if (name === 'pass') form.key = seedPrivate(value + form.username + 'liquidportfoliosdemo134');

    this.setState({
      form: {
        ...form,
        [name]: value,
        error: ''
      },
      loginError: 'none'
    });
  }

  handleChangeAccount(event) {
    // if not lower case, make lower case, only if eos account
    if (event.target.value.toString().match(/[A-Z]/) && event.target.value.length <= 12)
      this.setState({
        inputAccount: event.target.value.toString().toLowerCase(),
        addAccountErr: ''
      });
    else this.setState({ inputAccount: event.target.value.toString(), addAccountErr: '' });
  }

  render() {
    let islogin;
    if (!this.state.isLoggedIn) {
      islogin = (
        <Register
          displayLogin={this.state.displayLogin}
          show={this.state.displayLogin}
          showHideLogin={this.showHideLogin}
          login={this.login.bind(this)}
          logout={this.logout.bind(this)}
          handleChangeLogin={this.handleChangeLogin.bind(this)}
          error={this.state.loginError}
          username={this.state.form.username}
          password={this.state.form.pass}
          isSigningIn={this.state.isSigningIn}
          isLoggedIn={this.state.isLoggedIn}
          loginNameForm={this.state.form}
        />
      );
    } else {
      islogin = <div className='username'>{this.state.form.username}</div>;
    }
    let cells = this.state.board.cells.map((row, rowIndex) => {
      return (
        <div key={rowIndex}>
          {row.map((_, columnIndex) => (
            <Cell key={rowIndex * Board.size + columnIndex} />
          ))}
        </div>
      );
    });

    let tiles = this.state.board.tiles
      .filter((tile) => tile.value !== 0)
      .map((tile) => <TileView tile={tile} key={tile.id} />);
    return (
      <div>
        <div>
          <button onClick={this.saveGame}>Save</button>
        </div>
        <div className='scores'>
          <span className='score'>scores: {this.state.board.getScore()}</span>
          <span className='best-score'>best: {localStorage.getItem('bestscore')}</span>
        </div>

        <div className='newGame'>
          {islogin}
          <span onClick={this.newGame.bind(this)}>New Game</span>
        </div>
        <div
          className='board'
          onTouchStart={this.handleTouchStart.bind(this)}
          onTouchEnd={this.handleTouchEnd.bind(this)}
          tabIndex='1'
        >
          {cells}
          {tiles}
          <GameEndOverlay board={this.state.board} onRestart={this.saveGame.bind(this)} />
        </div>
        <div>
          <LeaderBoard />
        </div>
      </div>
    );
  }
}
