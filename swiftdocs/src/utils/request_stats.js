export function countByStatus(requests, status) {
  return requests.filter((item) => item.request?.status === status).length;
}
