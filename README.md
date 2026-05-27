# autosar-efficiency-templates

This is a repository collecting all the artifacts for the AUTOSAR efficiency templates.

Top level folders are categories, subfolders are present if the category has more than one topic.

Please note that this repository does not host the full RTA-SK project which is the basis for prototyping and measuring for the templates.

## Building the documentation

The documentation is written in Markdown, rendered with [Zensical](https://zensical.org/about/).

### Dependencies

- Python3
- pip
- Zensical
- mkdocs-glightbox (for image lightboxes)
- optional: Visual Studio Code for MD quick render, syntax highlighting etc.

### Installation
Create a new virtual environment in the root directory of the repository:
```
python -m venv venv
```
Source the new environment: 
```
.\venv\Scripts\activate
```
Install Zensical: 
```
pip install zensical
```
Install glightbox:
```
pip install mkdocs-glightbox
```

### Building

With the `venv` sourced, build the documentation with: 
```
zensical build
```
Alternatively, you can deploy the website on the local-host:
```
zensical serve
```
This will make the page available at [localhost:8000](http://localhost:8000)
