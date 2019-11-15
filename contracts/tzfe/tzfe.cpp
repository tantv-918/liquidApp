#include "tzfe.hpp"
#include "gameplay.cpp"

void tzfe::login(name username) {
  require_auth(username);

  auto user_iterator = _users.find(username.value);
  if (user_iterator == _users.end()) {
    user_iterator = _users.emplace(username, [&](auto& new_user){
      new_user.username = username;
    });
  }
}

void tzfe::startgame(name username){
  require_auth(username);

  auto& user = _users.get(username.value, "User doesn't exist");

  _users.modify(user, username, [&](auto& modified_user) {
    game game_data;

    game_data.flag_endgame = false;

    modified_user.current_game = game_data 
  });
}

void tzfe::savegame(name username, int state[][], long int score){
  require_auth(username);

  auto& user = _users.get(username.value, "User doesn't exist.");

  _users.modify(user, username, [&](auto& modified_user){
    game game_data;

    for(uint8_t i = 0; i < 4; i++){
      for(uint8_t j = 0; j < 4; j++){
        game_data.state[i][j] = state[i][j];
      }
    }
    game_data.flag_contiue = true;
    game_data.flag_endgame = false;
    modified_user.current_game = game_data;
  });
}

void tzfe.endgame(name username, int state[][], long int score, std::string date){
  require_auth(username);

  auto& user = _users.get(username.value, "User doesn't exist.");

  _users.modify(user, username, [&](auto& modified_user) {
    game game_data;

    for (uint8_t i = 0; i < 4; i++){
      for(uint8_t j = 0; j < 4; j++){
        game_data.state[i][j] = state[i][j];
      }
    }

    game_data.flag_endgame = true;
    game_data.flag_continue = false;
    game_data.score = score;

    modified_user.current_game = game_data;

    if(score > modified_user.best_score_game.score){
      rank rank_data;
      rank_data.username = username;
      rank.score = score;

      sort_rank(date, rank);

      modified_user.best_score_game = game_data;
    }
  });
}