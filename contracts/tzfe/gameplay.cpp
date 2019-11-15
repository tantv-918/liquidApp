#include "tzfe.hpp"

void tzfe::sort_rank(std::string date, rank rank_data){

  auto rank_iterator = _charts.find(date);
  if(rank_iterator == _charts.end()){
    rank top[100];
    top[0] = rank_date
    _charts.emplace(date, [&]( auto& row ) {
       row.date = date;
       row.top = top;
      });
  }
  else {
    rank top[100];
    uint8_t i = 0;

    for(i = 0; i < 100; i++) {
      if(rank_iterator.top[i].score > rank_data.score){
        top[i] = rank_iterator[i];
      }
      else {
        top[i] = data_rank;
        break;
      }
    }
    
    if(i < 99){
      for(uint j = i + 1; j < 100; j++){
        top[j] = rank_iterator[j-1];
      }
    }

    _charts.modify(rank_iterator, date, [&](auto& row) {
      row.date = date;
      row.top = top;
    });
  }
}