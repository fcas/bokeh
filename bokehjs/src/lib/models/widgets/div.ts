import {Markup, MarkupView} from "./markup"
import * as p from "core/properties"
import {TeXBox} from "core/math_graphics"

export class DivView extends MarkupView {
  override model: Div

  override async lazy_initialize(): Promise<void> {
    await super.lazy_initialize()
    await new TeXBox(this.model).load_provider()
  }

  override async render(): Promise<void> {
    super.render()
    if (this.model.render_as_text)
      this.markup_el.textContent = this.model.text
    else if (this.model.disable_math)
      this.markup_el.innerHTML = this.model.text
    else
      this.markup_el.innerHTML = new TeXBox(this.model).to_html_string()
  }
}

export namespace Div {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Markup.Props & {
    render_as_text: p.Property<boolean>
  }
}

export interface Div extends Div.Attrs {}

export class Div extends Markup {
  override properties: Div.Props
  override __view_type__: DivView

  constructor(attrs?: Partial<Div.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = DivView

    this.define<Div.Props>(({Boolean}) => ({
      render_as_text: [ Boolean, false ],
    }))
  }
}
