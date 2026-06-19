# BidFlow API

Base URL: `/api`

## Auth

`POST /auth/register`

```json
{ "name": "Ava Buyer", "email": "ava@example.com", "password": "password123", "role": "buyer" }
```

`POST /auth/login`

```json
{ "email": "ava@example.com", "password": "password123" }
```

`GET /auth/me` requires `Authorization: Bearer <token>`.

## Products

Seller/Admin only.

`GET /products` lists products owned by the current seller.

`POST /products` creates a product using `multipart/form-data`:

- `title`
- `description`
- `category`
- `condition`
- `location`
- `images`

`PUT /products/:id` updates a seller-owned product.

## Auctions

`GET /auctions?q=&category=&status=&min=&max=` lists auctions.

`GET /auctions/:id` returns an auction and bid history.

Seller/Admin only:

`POST /auctions`

```json
{
  "product": "PRODUCT_ID",
  "startingPrice": 100,
  "reservePrice": 200,
  "bidIncrement": 10,
  "startTime": "2026-05-12T10:00:00.000Z",
  "endTime": "2026-05-13T10:00:00.000Z"
}
```

`PUT /auctions/:id` edits an auction with no bids.

`DELETE /auctions/:id` deletes or cancels an auction.

Buyer/Admin only:

`POST /auctions/:id/bids`

```json
{ "amount": 250 }
```

`POST /auctions/:id/wishlist` toggles wishlist membership.

`GET /auctions/buyer/dashboard` returns buyer bids and wins.

`GET /auctions/seller/dashboard` returns seller auctions and stats.

## Notifications

`GET /notifications`

`PATCH /notifications/:id/read`

## Transactions

`GET /transactions`

`POST /transactions/pay/:auctionId` completes the mock winner payment.

## Admin

Admin only.

`GET /admin/analytics`

`GET /admin/users`

`PATCH /admin/users/:id/status`

```json
{ "isActive": false }
```

`GET /admin/auctions`

`PATCH /admin/auctions/:id/status`

```json
{ "status": "cancelled" }
```

## Socket.IO Events

Client emits:

- `auction:join` with `auctionId`
- `auction:leave` with `auctionId`

Server emits:

- `bid:updated` with `{ auction, bid }`
- `auction:closed` with `{ auction }`
