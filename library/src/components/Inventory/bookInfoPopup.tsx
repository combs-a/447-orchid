"use client";

import Popup from "@/components/Popup";

type Item = {
  item_id: number;
  title: string;
  description: string;
  isbn: string;
  publication_date: string;
  publisher: string;
  issue_number: number | null;
  explicit: boolean;
  publication_year: number;
  total_quantity: number;
  reservation_amount: number;
  contributor_f_name: string;
  contributor_l_name: string;
  contributor_role_name: string;
};

interface BookInfoPopupProps {
  item: Item;
  onClose: () => void;
}

export default function BookInfoPopup({ item, onClose }: BookInfoPopupProps) {
  return (
    <Popup title={`More Information: ${item.title}`} onClose={onClose}>
      <div className="space-y-4">
        <p>
          <strong>Description:</strong> {item.description}
        </p>
        <p>
          <strong>ISBN:</strong> {item.isbn}
        </p>
        <p>
          <strong>Publication Date:</strong> {item.publication_date}
        </p>
        <p>
          <strong>Publisher:</strong> {item.publisher}
        </p>
        <p>
          <strong>Issue Number:</strong> {item.issue_number !== null ? item.issue_number : "N/A"}
        </p>
        <p>
          <strong>Explicit Content:</strong> {item.explicit ? "Yes" : "No"}
        </p>
        <p>
          <strong>Publication Year:</strong> {item.publication_year}
        </p>
        <p>
          <strong>Total Quantity:</strong> {item.total_quantity}
        </p>
        <p>
          <strong>Reservation Amount:</strong> {item.reservation_amount}
        </p>
        <p>
          <strong>Contributors:</strong> {`${item.contributor_f_name} ${item.contributor_l_name} (${item.contributor_role_name})`}
        </p>
      </div>
    </Popup>
  );
}