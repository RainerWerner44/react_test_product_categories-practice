/* eslint-disable jsx-a11y/accessible-emoji */
import './App.scss';
import { useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUserById(userId) {
  return usersFromServer.find(user => user.id === userId) || null;
}

const categories = categoriesFromServer.map(category => ({
  ...category,
  ownerId: getUserById(category.ownerId),
}));

function getCategoriesByProductId(productId) {
  return categories.find(category => category.id === productId);
}

const products = productsFromServer.map(product => ({
  ...product,
  categoryId: getCategoriesByProductId(product.categoryId),
}));

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [inputQuery, setInputQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleUserFilter = user => {
    setSelectedUser(user);
  };

  const handleCategoryFilter = category => {
    setSelectedCategory(prevSelectedCategories => {
      if (category === 'all') {
        return ['all'];
      } else {
        if (prevSelectedCategories.includes(category)) {
          return prevSelectedCategories.filter(cat => cat !== category);
        } else {
          return [...prevSelectedCategories, category];
        }
      }
    });
  };

  const filteredProducts = products.filter(product => {
    const filterByUser =
      selectedUser === 'all' || product.categoryId.ownerId === selectedUser;
    const filterByQuery =
      inputQuery === '' ||
      product.name.toLocaleLowerCase().includes(inputQuery.toLocaleLowerCase());
    const filterByCategory =
      selectedCategory === 'all' ||
      product.categoryId.title === selectedCategory;

    return filterByQuery && filterByUser && filterByCategory;
  });

  const handleResetAllFiltersClick = () => {
    setInputQuery('');
    setSelectedUser('all');
    setSelectedCategory('all');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => handleUserFilter('all')}
                className={selectedUser === 'all' ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => handleUserFilter(user)}
                    className={user === selectedUser ? 'is-active' : ''}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={inputQuery}
                  onChange={event => setInputQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {!!inputQuery && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setInputQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategory === 'all' ? '' : 'is-outlined'}`}
                onClick={() => handleCategoryFilter('all')}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={
                      category.title === selectedCategory
                        ? 'button mr-2 my-1 is-info'
                        : 'button mr-2 my-1 '
                    }
                    href="#/"
                    onClick={() => handleCategoryFilter(category.title)}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFiltersClick}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {filteredProducts.length > 0 ? (
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>
                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.categoryId.icon} - {product.categoryId.title}
                  </td>
                  <td
                    data-cy="ProductUser"
                    className={
                      product.categoryId.ownerId.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                  >
                    {product.categoryId.ownerId.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="box table-container">
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
