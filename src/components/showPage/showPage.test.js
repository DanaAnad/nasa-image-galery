import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShowPage from './showPage';

describe('ShowPage', () => {
  let mockAxios;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

it('should display the collection item details on successful API response', async () => {
    const itemId = '123';

    const responseMock = {
      data: {
        collection: {
          items: [
            {
              data: [
                {
                  nasa_id: itemId,
                  title: 'Test Image',
                  location: 'Test Location',
                  photographer: 'Test Photographer',
                  description: 'Test Description',
                  keywords: ['keyword1', 'keyword2'],
                  date_created: '2023-05-15T12:34:56Z'
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

    mockAxios
      .onGet(`https://images-api.nasa.gov/search?nasa_id=${itemId}`)
      .reply(200, responseMock);

    render(
      <Router>
        <Routes>
            <Route path="/show/:id" component={ShowPage} />
        </Routes>
      </Router>
    );

    await waitFor(() => {
      const itemTitle = screen.getByText('Test Image');
      expect(itemTitle).toBeInTheDocument();
    });      
        const imageItem = screen.getByAltText('Test Image');
        const itemLocation = screen.getByText('Test Location');
        const itemPhotographer = screen.getByText('Test Photographer');
        const itemDescription = screen.getByText('Test Description');
        const itemKeywords = screen.getByText('keyword1, keyword2');
        const itemDate = screen.getByText('15/05/2023');
        const backButton = screen.getByRole('button', { name: 'Back' });

        expect(imageItem).toBeInTheDocument();
        expect(itemLocation).toBeInTheDocument();
        expect(itemPhotographer).toBeInTheDocument();
        expect(itemDescription).toBeInTheDocument();
        expect(itemKeywords).toBeInTheDocument();
        expect(itemDate).toBeInTheDocument();
        expect(backButton).toBeInTheDocument();
});

  it('should display "Loading..." message while fetching collection item details', async () => {
    const itemId = '123';

    mockAxios
      .onGet(`https://images-api.nasa.gov/search?nasa_id=${itemId}`)
      .reply(200, { data: { collection: { items: [] } } });

    render(
      <Router>
        <Routes>
            <Route path="/show/:id" component={ShowPage} />
        </Routes>
      </Router>
    );

    const loadingMessage = screen.getByText('Loading...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('should handle API error', async () => {
    const itemId = '123';

    mockAxios
      .onGet(`https://images-api.nasa.gov/search?nasa_id=${itemId}`)
      .reply(500);

    render(
      <Router>
        <Routes>
            <Route path="/show/:id" component={ShowPage} />
        </Routes>
      </Router>
    );

    await waitFor(() => {
      const errorMessage = screen.getByText(
        'An unexpected error occurred. Please try again later.'
      );

      expect(errorMessage).toBeInTheDocument();
    });
  });
});