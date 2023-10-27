import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SearchPage from './searchPage';

describe('SearchPage', () => {
  let mockAxios;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should display search results on successful API response', async () => {
    const responseMock = {
      data: {
        collection: {
          items: [
            {
              data: [
                {
                  nasa_id: '123',
                  title: 'Test Image',
                  location: 'Test Location',
                  photographer: 'Test Photographer'
                }
              ],
              links: [
                {
                  href: 'https://example.com/image.jpg'
                }
              ]
            }
          ]
        }
      }
    };

    mockAxios.onGet('https://images-api.nasa.gov/search').reply(200, responseMock);

    render(<SearchPage />);

    const queryInput = screen.getByLabelText('Find:');
    const searchButton = screen.getByText('Search');

    fireEvent.change(queryInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const photoTitle = screen.getByText('Test Image');
      expect(photoTitle).toBeInTheDocument();
    });
    const location = screen.getByText('Test Location');
    const photographer = screen.getByText('Test Photographer');
    const viewDetailsLink = screen.getByText('View Details');

    expect(location).toBeInTheDocument();
    expect(photographer).toBeInTheDocument();
    expect(viewDetailsLink).toHaveAttribute('href', '/show/123');
  });

  it('should display "No items found" message when no search results are returned', async () => {
    const responseMock = {
      data: {
        collection: {
          items: []
        }
      }
    };

    mockAxios.onGet('https://images-api.nasa.gov/search').reply(200, responseMock);

    render(<SearchPage />);

    const queryInput = screen.getByLabelText('Find:');
    const searchButton = screen.getByText('Search');

    fireEvent.change(queryInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const noItemsMessage = screen.getByText('No items found. Please check your search.');

      expect(noItemsMessage).toBeInTheDocument();
    });
  });

  it('should display an error message on API error', async () => {
    mockAxios.onGet('https://images-api.nasa.gov/search').reply(500);

    render(<SearchPage />);

    const queryInput = screen.getByLabelText('Find:');
    const searchButton = screen.getByText('Search');

    fireEvent.change(queryInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('An unexpected error occurred. Please try again later.');

      expect(errorMessage).toBeInTheDocument();
    });
  });
});