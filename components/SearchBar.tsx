"use client";
import { Product } from "@/sanity.types";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import { client } from "@/sanity/lib/client";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useOutsideClick<HTMLDivElement>(() => {
    setShowResults(false);
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setLoading(true);
      setShowResults(true);
      try {
        const results = await client.fetch<Product[]>(
          `*[_type == "product" && (name match $searchTerm || description match $searchTerm)] {
            _id,
            name,
            description,
            price,
            images,
            slug,
            "categories": categories[]->title
          }`,
          { searchTerm: `${query}*` }
        );
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="flex items-center gap-2 border rounded-full px-3 py-1.5">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          className="outline-none text-sm w-40 md:w-60"
        />
        {searchQuery && (
          <X
            onClick={() => {
              setSearchQuery("");
              setShowResults(false);
              setSearchResults([]);
            }}
            className="w-5 h-5 text-gray-400 cursor-pointer"
          />
        )}
      </div>

      {showResults && (
        <div className="absolute top-12 left-0 w-72 md:w-96 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50 scrollbar-hide border border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Searching products...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug?.current}`}
                  onClick={() => {
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  {product.images && product.images[0] && (
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={urlFor(product.images[0]).url()}
                        alt={product.name || "product"}
                        width={48}
                        height={48}
                        className="rounded-md object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ${product.price?.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;