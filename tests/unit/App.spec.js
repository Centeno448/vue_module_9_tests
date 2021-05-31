import { mount, shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

test('App.vue muestra el titulo de las notas dentro de una lista | Asegúrate de que App.vue defina en su función data la propiedad "notas", y que por cada elemento se despliegue un boton con el titulo de la nota', () => {
  const notas = [{ titulo: "testing 12", contenido: "Contenido 1" }, { titulo: "testing 3", contenido: "Contenido 1" }];

  const wrapper = shallowMount(App, {
    data() {
      return {
        notas,
        notaActual: null
      };
    }
  });

  const listItems = wrapper.findAll("li");

  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const button = item.find('button');
    expect(button.text()).toBe(notas[i].titulo);
  }
});

test('App.vue muestra "No hay notas guardadas" cuando el arreglo de notas está vacío | Asegúrate de que App.vue muestre un <p> con "No hay notas guardadas" cuando el arreglo de notas se encuentre vacío', () => {
  const notas = [];

  const wrapper = shallowMount(App, {
    data() {
      return {
        notas,
        notaActual: null
      };
    }
  });

  const p = wrapper.get("p");

  expect(p.text().toLowerCase()).toBe('no hay notas guardadas');
});

test('App.vue muestra la nota actual cuándo es seleccionada | Asegúrate de que por cada nota, se despliegue un boton que, al presionarlo asigne la variable notaActual a la nota seleccionada', async () => {
  const notas = [{ titulo: "testing 12", contenido: "Contenido 1" }, { titulo: "testing 2", contenido: "Contenido 4" }];

  const wrapper = shallowMount(App, {
    data() {
      return {
        notas,
        notaActual: null
      };
    }
  });

  const buttons = wrapper.findAll('button').filter(button => button.text().toLowerCase() !== "crear nota");;

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    await button.trigger('click');
    expect(wrapper.find('textarea').element.value.toLowerCase()).toBe(notas[i].contenido.toLowerCase());
    expect(wrapper.find('input[type="text"]').element.value.toLowerCase()).toBe(notas[i].titulo.toLowerCase());
  }
});


test('App.vue no muestra información de la notaActual hasta que algún boton haya sido apretado | Asegúrate de que App.vue despliegue la información de la notaActual SOLO si notaActual se encuentra definida', async () => {
  const notas = [{ titulo: "testing 12", contenido: "Contenido 1" }, { titulo: "testing 2", contenido: "Contenido 4" }];

  const wrapper = shallowMount(App, {
    data() {
      return {
        notas,
        notaActual: null
      };
    }
  });

  expect(wrapper.find('input[type="text"]').exists()).toBe(false);
  expect(wrapper.find('textarea').exists()).toBe(false);
});

test('App.vue asigna la clase "active" a la nota seleccionada | Asegúrate de que cuando la nota sea la notaActiva, su botón tenga asignado la clase "active" y el resto de los botones no', async () => {
  const notas = [{ titulo: "testing 12", contenido: "Contenido 1" }, { titulo: "testing 2", contenido: "Contenido 4" }];

  const wrapper = shallowMount(App, {
    data() {
      return {
        notas,
        notaActual: null
      };
    }
  });

  const buttons = wrapper.findAll('button').filter(button => button.text().toLowerCase() !== "crear nota");

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    await button.trigger('click');
    expect(button.classes()).toContain('active');

    const otherButtons = buttons.filter((value, index) => {
      index != i;
    });

    for (let k = 0; k < otherButtons.length; k++) {
      const otherButton = otherButtons[k];
      expect(otherButton.classes()).not.toContain('active');
    }

  }
});

test('App utiliza two-way binding en los valores de notaActual | Asegúrate de que utilices la directiva v-model para habilitar el two-way data binding en el input y textarea de las propiedades de notaActual', async () => {
  const notas = [{ titulo: "testing 12", contenido: "Contenido 1" }, { titulo: "testing 2", contenido: "Contenido 4" }];

  const wrapper = shallowMount(App, {
    data() {
      return {
        notas,
        notaActual: notas[0]
      };
    }
  });

  expect(wrapper.find('input[type="text"]').element.value.toLowerCase()).toBe(wrapper.vm.notaActual.titulo.toLowerCase());
  expect(wrapper.find('textarea').element.value.toLowerCase()).toBe(wrapper.vm.notaActual.contenido.toLowerCase());

  notas[0].contenido = "cambiado";
  notas[0].titulo = "titulo cambiado";

  await wrapper.setData({notaActual: notas[0]});

  expect(wrapper.find('textarea').element.value.toLowerCase()).toBe(wrapper.vm.notaActual.contenido.toLowerCase());
  expect(wrapper.find('input[type="text"]').element.value.toLowerCase()).toBe(wrapper.vm.notaActual.titulo.toLowerCase());

  await wrapper.find('textarea').setValue('nuevo cambio');
  await wrapper.find('input[type="text"]').setValue('nuevo titulo cambio');

  expect(wrapper.vm.notaActual.contenido.toLowerCase()).toBe('nuevo cambio');
  expect(wrapper.vm.notaActual.titulo.toLowerCase()).toBe('nuevo titulo cambio');
});

test('App crea una nueva nota al presionar el boton "crear nota" | Asegúrate de que al presionar el boton que diga "Crear nota" se inserte una nueva nota en el array de notas con el titulo y el contenido vacíos', async () => {
  const notas = [{ titulo: "testing 12", contenido: "Contenido 1" }, { titulo: "testing 2", contenido: "Contenido 4" }];

  const wrapper = shallowMount(App, {
    data() {
      return {
        notas,
        notaActual: notas[0]
      };
    }
  });

  const allButtons = wrapper.findAll('button');

  const newNoteButton = allButtons.find(button => button.text().toLowerCase() === 'crear nota');

  await newNoteButton.trigger('click');

  expect(wrapper.vm.notas.length).toBe(3);

  const newNota = wrapper.vm.notas[2];

  expect(newNota.titulo).toBe('');
  expect(newNota.contenido).toBe('');
});

test('App utiliza una ref llamada notaTitulo para hacerle focus al input del titulo al crear nueva nota | Asegúrate de que el input del titulo de notaActual tenga una ref con el nombre notaTitulo y esta se encuentre en focus cuando el usuario aprete el botón de nueva nota', async () => {
  const notas = [];

  const wrapper = mount(App, {
    data() {
      return {
        notas,
        notaActual: null
      };
    },
    attachTo: document.body
  });

  const newNoteButton = wrapper.findAll('button').find(button => button.text().toLowerCase() === 'crear nota');

  await newNoteButton.trigger('click');

  expect(wrapper.vm.$refs.notaTitulo).toBeDefined();

  expect(wrapper.vm.$refs.notaTitulo).toBe(document.activeElement);
});