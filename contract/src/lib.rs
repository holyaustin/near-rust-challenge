use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, setup_alloc};
use near_sdk::collections::LookupMap;

setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct HelloName {
    records: LookupMap<String, String>,
}

impl Default for HelloName {
  fn default() -> Self {
    Self {
      records: LookupMap::new(b"a".to_vec()),
    }
  }
}

#[near_bindgen]
impl HelloName {
    pub fn get_username(&self, name: String) -> String {
        format!("Hello {}!", name)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn test_() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = HelloName::default();
        assert_eq!(
            "Hello Thomas Brown!".to_string(),
            contract.get_username("Thomas Brown".to_string())
        );
    }
}
