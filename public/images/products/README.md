# Product photos

One folder per band. Name each photo `{band}_{category}.{ext}`:

| Folder     | Band              | Files                                                                                      |
|------------|-------------------|--------------------------------------------------------------------------------------------|
| `the1975/` | The 1975          | `the1975_shirt.jpg`, `the1975_hoodie.jpg`, `the1975_accessory.jpg`, `the1975_music.jpg`     |
| `nbhd/`    | The Neighbourhood | `nbhd_shirt.jpg`, `nbhd_hoodie.jpg`, `nbhd_accessory.jpg`, `nbhd_music.jpg`                 |
| `wknd/`    | The Weeknd        | `wknd_shirt.jpg`, `wknd_hoodie.jpg`, `wknd_accessory.jpg`, `wknd_music.jpg`                 |
| `focean/`  | Frank Ocean       | `focean_shirt.jpg`, `focean_hoodie.jpg`, `focean_accessory.jpg`, `focean_music.jpg`         |

What each photo should show (matches the seeded product descriptions):

- **shirt**: a graphic tee
- **hoodie**: a pullover hoodie
- **accessory**: a canvas tote bag
- **music**: a vinyl record

Rules:

- Plural also works (`shirts`, `hoodies`, `accessories`).
- `.jpg`, `.jpeg`, `.png`, `.webp` and `.avif` all work.
- Use **lowercase** names. The live server runs Linux, where `The1975_Shirt.jpg` won't match.
- Square images look best (cards crop to a square). Keep each under ~500 KB.

After adding photos, run `php artisan db:seed --class=ProductSeeder` to attach them. Deploys do this automatically.
Products still without a photo show `placeholder.png`. Images an admin uploads through the dashboard are never replaced.
