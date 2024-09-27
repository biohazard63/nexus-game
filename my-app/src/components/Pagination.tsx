import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          totalItems,
                                                          itemsPerPage,
                                                          currentPage,
                                                          onPageChange,
                                                      }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPageNumbersToShow = 5; // Nombre maximum de boutons de page à afficher

    const getPageNumbers = () => {
        const pageNumbers = [];
        const halfWay = Math.floor(maxPageNumbersToShow / 2);

        let startPage = currentPage - halfWay;
        let endPage = currentPage + halfWay;

        if (startPage <= 0) {
            startPage = 1;
            endPage = maxPageNumbersToShow;
        }

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - maxPageNumbersToShow + 1;
            if (startPage <= 0) {
                startPage = 1;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-wrap justify-center mt-4 space-x-2 space-y-2">
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="px-2 py-1 text-sm"
            >
                Précédent
            </Button>

            {currentPage > Math.floor(maxPageNumbersToShow / 2) + 1 && totalPages > maxPageNumbersToShow && (
                <>
                    <Button
                        onClick={() => onPageChange(1)}
                        variant={currentPage === 1 ? 'default' : 'outline'}
                        className="px-2 py-1 text-sm"
                    >
                        1
                    </Button>
                    <span className="text-white mx-1">...</span>
                </>
            )}

            {pageNumbers.map((number) => (
                <Button
                    key={number}
                    onClick={() => onPageChange(number)}
                    variant={number === currentPage ? 'default' : 'outline'}
                    className="px-2 py-1 text-sm"
                >
                    {number}
                </Button>
            ))}

            {currentPage < totalPages - Math.floor(maxPageNumbersToShow / 2) && totalPages > maxPageNumbersToShow && (
                <>
                    <span className="text-white mx-1">...</span>
                    <Button
                        onClick={() => onPageChange(totalPages)}
                        variant={currentPage === totalPages ? 'default' : 'outline'}
                        className="px-2 py-1 text-sm"
                    >
                        {totalPages}
                    </Button>
                </>
            )}

            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="px-2 py-1 text-sm"
            >
                Suivant
            </Button>
        </div>
    );
};