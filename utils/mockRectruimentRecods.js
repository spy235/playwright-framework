export async function mockEmptyRecruitmentApi(page) {
  await page.route(
    "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/recruitment/candidates?limit=50&offset=0&model=list&sortField=candidate.dateOfApplication&sortOrder=DESC",
    async (route) => {
      const fakePayload = {
        data: [],
        meta: { total: 0 },
        rels: []
      };

      const response = await page.request.fetch(route.request());

      await route.fulfill({
        status: 200,
        headers: {
          ...response.headers(),
          "content-type": "application/json"
        },
        body: JSON.stringify(fakePayload),
      });
    }
  );
}
export async function mockRequestDetailsApi(page) {
  const requestEdp = /employees\/\d+\/personal-details/;

  await page.route(requestEdp, route => {
    const newUrl =
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/11111111/personal-details";

    route.continue({ url: newUrl });
  });
}
