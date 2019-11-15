#pragma once

#include <eosiolib/eosio.hpp>
#include "../dappservices/multi_index.hpp"
#define DAPPSERVICES_ACTIONS() \
	XSIGNAL_DAPPSERVICE_ACTION \
	IPFS_DAPPSERVICE_ACTIONS
#define DAPPSERVICE_ACTIONS_COMMANDS() \
	IPFS_SVC_COMMANDS()
#define CONTRACT_NAME() tzfe
using std::string;

using namespace std;
using namespace eosio;

CONTRACT_START()
	private:

		struct game {
			int state[][];
			long int score;
			bool flag_continue;
			bool flag_endgame;
		};

		struct [[eosio::table]] user_info  {
			name username;
			game current_game;
			game best_score_game;

			auto primary_key() const { return username.value; }
		};

		struct rank {
			name username;
			long int score;
		};

		struct [[eosio::table]] charts {
			std::string date;
			rank top[100];

			auto primary_key() const { return date.value; }
		};

		typedef dapp::multi_index<name("users"), user_info> users_table;
		typedef eosio::multi_index<".users"_n, user_info> users_table_v_abi;
		TABLE shardbucket {
			std::vector<char> shard_uri;
			uint64_t shard;
			uint64_t primary_key() const {return shard;}
		};

		typedef eosio::multi_index<"users"_n, shardbucket> users_table_abi;

		typedef eosio::multi_index<name("charts"), charts> charts_table;

		users_table _users;
		charts_table  _charts;

	public:
		tzfe(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds),
			_users(receiver, receiver.value){}

		[[eosio::action]]
		void login(name username);

		[[eosio::action]]
		void startgame(name username);

		// [[eosio::action]]
		// void continuegame(name username);

		[[eosio::action]]
		void savegame(name username, int state[][], long int score);

		[[eosio::action]]
		void endgame(name username, int state[][], long int score, std::string date);

CONTRACT_END(login)(startgame)(savegame)(continuegame)(endgame))
