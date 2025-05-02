export type Account = {
    account_id: number;
    first_name: string;
    last_name: string;
    middle_initial: string | null;
    card_number: string;
    account_type_id: number;
    restricted: boolean;
    address: string | null;
    birthdate: string;
    email: string;
    phone_number: string | null;
    parent_id: number | null;
  };
  