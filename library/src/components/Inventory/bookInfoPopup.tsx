"use client";

import Popup from "@/components/Popup"

// Contritbutor type, servers to retrive individual contributor info from the API, and then
// concatenate multiple contributors at rendering
type Contributor = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  role_name: string;
};

type Item = {
  item_id: number;
  item_type_name: string;
  title: string;
  description: string;
  isbn: string;
  publication_date: string;
  publisher: string;
  issue_number: number | null;
  explicit: boolean;
  publication_year: number;
  total_quantity: number;
  rating_name: number | null;
  genre_name: number;
  reservation_amount: number;
  contributors?: Contributor[];
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
        {item.contributors && item.contributors.length > 0 ? (
          <>
            <p>
              <strong>Contributors:</strong> {`${item.contributors[0].first_name} ${item.contributors[0].middle_name ? item.contributors[0].middle_name + " " : ""}${item.contributors[0].last_name} (${item.contributors[0].role_name})`}
            </p>
            {item.contributors.length > 1 && (
              <div>
                <strong>Additional Contributors:</strong>
                <ul>
                  {/* section that sices contributors into multiple text displays */}
                  {item.contributors.slice(1).map((contributor, index) => (
                    <li key={index}>
                      {contributor.first_name} {contributor.middle_name ? contributor.middle_name + " " : ""}{contributor.last_name} ({contributor.role_name})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p>
            <strong>Contributors:</strong> N/A
          </p>
        )}
        <p>
          <strong>Genre:</strong> {`${item.genre_name}`}
        </p>
        <p>
          <strong>Rating:</strong> {item.rating_name !== null ? item.rating_name : "N/A"}
        </p>
      </div>
    </Popup>
  );
}